import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setAuth, setToken, logout } from "../slices/auth";
import type { RootState } from "../store";

/* ======================
   Types
====================== */

interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface RefreshResponse {
  accessToken: string;
}

/* ======================
   Base Query
====================== */

const baseQuery = fetchBaseQuery({
  baseUrl: "https://jacelyn-undelineable-maynard.ngrok-free.dev/api",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.token;

    // ❌ DO NOT send access token when refreshing
    if (token && endpoint !== "refresh") {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("ngrok-skip-browser-warning", "true");
    return headers;
  },
  credentials: "include",
});

/* ======================
   Reauth Wrapper
====================== */

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const isRefreshEndpoint =
    typeof args !== "string" && args.url.includes("/auth/refresh");

  if (result.error?.status === 401 && !isRefreshEndpoint) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      { ...api, endpoint: "refresh" }, // 👈 important
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as RefreshResponse;

      if (accessToken) {
        api.dispatch(setToken(accessToken));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

/* ======================
   API Slice
====================== */

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Roles",
    "Categories",
    "Courses",
    "Enrollments",
    "Leads",
    "Students",
  ],
  endpoints: (builder) => ({
    /* ---------- AUTH ---------- */

    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: (body) => ({
          url: "/auth/login",
          method: "POST",
          body,
        }),

        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setAuth(data));
          } catch {
            // handled by UI
          }
        },
      },
    ),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(api.util.resetApiState());
        dispatch(logout());
      },
    }),

    getCurrentUser: builder.query<LoginResponse, void>({
      query: () => "/auth/me",
    }),

    /* ---------- USERS ---------- */

    getUsers: builder.query<any[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    toggleUserStatus: builder.mutation<void, { id: number; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: "PUT",
        body: JSON.stringify(status),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Users"],
    }),

    addUser: builder.mutation<void, any>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Users"],
    }),

    resetPass: builder.mutation<void, { id: number; newPassword: string }>({
      query: ({ id, newPassword }) => ({
        url: `/users/${id}/reset-password`,
        method: "PUT",
        body: { newPassword }, // ✅ correct shape
      }),
    }),

    /* ---------- ROLES ---------- */

    getRoles: builder.query<any[], void>({
      query: () => "/roles",
      providesTags: ["Roles"],
    }),
    // Categories
    getCategories: builder.query<any[], void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    // Courses
    getCourses: builder.query<any[], void>({
      query: () => "/courses",
      providesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
    // Enrollments
    getEnrollments: builder.query<any[], void>({
      query: () => "/enrollments",
      providesTags: ["Enrollments"],
    }),
    getFilteredEnrollments: builder.mutation<any, { statusId: number }>({
      query: ({ statusId }) => ({
        url: `/enrollments?status=${statusId}`,
        method: "GET",
      }),
    }),
    deleteEnrollment: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/enrollments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollments"],
    }),
    // Leads
    getLeads: builder.query<{ data: any }, void>({
      query: () => "/leads",
      providesTags: ["Leads"],
    }),
    getSpecificLeads: builder.mutation<
      { data: any },
      { pageNumber: number; pageSize: number }
    >({
      query: ({ pageNumber, pageSize }) => ({
        url: `/leads?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    addLead: builder.mutation<
      void,
      { fullName: string; email: string; phone: string; source: string }
    >({
      query: ({ fullName, email, phone, source }) => ({
        url: `/leads`,
        method: "POST",
        body: { fullName, phone, email, source }, // ✅ correct shape
      }),
    }),
    getFilteredLeads: builder.mutation<any, { statusId: number }>({
      query: ({ statusId }) => ({
        url: `/leads?status=${statusId}`,
        method: "GET",
      }),
    }),
    deleteLead: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leads"],
    }),
    getLeadNotes: builder.query<any, { id: number }>({
      query: ({ id }) => ({
        url: `/leads/${id}/notes`,
      }),
    }),
    getLeadFollowup: builder.query<any, { id: number }>({
      query: ({ id }) => ({
        url: `/leads/${id}/follow-up`,
      }),
    }),

    // students
    getStudents: builder.query<any[], void>({
      query: () => "/students",
      providesTags: ["Students"],
    }),
    searchStudents: builder.mutation<any[], { name: string }>({
      query: ({ name }) => ({
        url: `/students/by-name?fullname=${name}`,
        method: "GET",
      }),
    }),
    deleteStudent: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),
    convertStatus: builder.mutation<
      void,
      { id: number; courseId: number; paidAmount: number }
    >({
      query: ({ id, courseId, paidAmount }) => ({
        url: `/leads/${id}/convert`,
        method: "POST",
        body: { courseId, paidAmount }, // ✅ correct shape
      }),
      invalidatesTags: ["Leads"],
    }),
    addCategory: builder.mutation<void, { name: string }>({
      query: ({ name }) => ({
        url: `/categories`,
        method: "POST",
        body: { name }, // ✅ correct shape
      }),
      invalidatesTags: ["Categories"],
    }),
    addCourse: builder.mutation<
      void,
      {
        name: string;
        code: string;
        description: string;
        price: number;
        durationInHours: number;
        maxStudents?: number | null;
        startDate: string;
        endDate: string;
        categoryId: number;
      }
    >({
      query: ({
        name,
        code,
        description,
        price,
        durationInHours,
        maxStudents,
        startDate,
        endDate,
        categoryId,
      }) => ({
        url: `/courses`,
        method: "POST",
        body: {
          name,
          code,
          description,
          price,
          durationInHours,
          maxStudents,
          startDate,
          endDate,
          categoryId,
        },
      }),
      invalidatesTags: ["Courses"],
    }),
    addEnrollment: builder.mutation<
      void,
      { studentId: number; courseId: number }
    >({
      query: ({ studentId, courseId }) => ({
        url: `/enrollments?studentId=${studentId}&courseId=${courseId}`,
        method: "POST",
      }),
      invalidatesTags: ["Enrollments"],
    }),
    addLeadNote: builder.mutation<void, { id: number; note: string }>({
      query: ({ id, note }) => ({
        url: `/leads/${id}/notes`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: ["Enrollments"],
    }),
    addStudent: builder.mutation<
      void,
      {
        fullName: string;
        email: string;
        phoneNumber: string;
        nationalId: string;
        gender: string;
        dateOfBirth: string;
        relativeName: string;
        parentPhoneNumber: string;
        level: string;
      }
    >({
      query: (body) => ({
        url: `/students`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Students"],
    }),
    getFollowupToday: builder.query<any, void>({
      query: () => ({
        url: `/leads/follow-ups/today`,
      }),
    }),
    getFollowupOverdue: builder.mutation<any, void>({
      query: () => ({
        url: `/leads/follow-ups/overdue`,
        method: "GET",
      }),
    }),
    getFollowupRange: builder.mutation<any, { from: string; to: string }>({
      query: ({ from, to }) => ({
        url: `/leads/follow-ups/range?from=${from}&to=${to}`,
        method: "GET",
      }),
    }),
    getCategory: builder.query<any, { id: number }>({
      query: ({ id }) => ({
        url: `/categories/${id}`,
      }),
    }),
    updateCategory: builder.mutation<any, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["Categories"],
    }),
    getEnrollment: builder.query<any, { id: number }>({
      query: ({ id }) => ({
        url: `/enrollments/${id}`,
      }),
    }),
    updateEnrollment: builder.mutation<
      any,
      { id: number; studentId: number; courseId: number }
    >({
      query: ({ id, studentId, courseId }) => ({
        url: `/enrollments/${id}`,
        method: "PUT",
        body: { studentId, courseId },
      }),
      invalidatesTags: ["Enrollments"],
    }),
    convertEnrollmentStatus: builder.mutation<
      void,
      { id: number; status: number }
    >({
      query: ({ id, status }) => ({
        url: `/enrollments/${id}/status`,
        method: "PUT",
        body: { status }, // ✅ correct shape
      }),
      invalidatesTags: ["Enrollments"],
    }),
  }),
});

/* ======================
   Hooks
====================== */

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useToggleUserStatusMutation,
  useGetRolesQuery,
  useAddUserMutation,
  useResetPassMutation,
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useGetEnrollmentsQuery,
  useGetFilteredEnrollmentsMutation,
  useDeleteEnrollmentMutation,
  useGetLeadsQuery,
  useGetFilteredLeadsMutation,
  useDeleteLeadMutation,
  useGetLeadNotesQuery,
  useGetLeadFollowupQuery,
  useGetStudentsQuery,
  useDeleteStudentMutation,
  useSearchStudentsMutation,
  useConvertStatusMutation,
  useAddLeadMutation,
  useGetSpecificLeadsMutation,
  useAddCategoryMutation,
  useAddCourseMutation,
  useAddEnrollmentMutation,
  useAddLeadNoteMutation,
  useAddStudentMutation,
  useGetFollowupTodayQuery,
  useGetFollowupOverdueMutation,
  useGetFollowupRangeMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useGetEnrollmentQuery,
  useUpdateEnrollmentMutation,
  useConvertEnrollmentStatusMutation,
} = api;
