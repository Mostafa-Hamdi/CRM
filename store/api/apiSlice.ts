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
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
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
    (typeof args === "string" ? args : args.url) === "/auth/refresh";

  if (result.error?.status === 401 && !isRefreshEndpoint) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
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
  tagTypes: ["Users", "Roles", "Categories", "Courses"],
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
} = api;
