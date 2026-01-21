import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setToken, logout, User } from "../slices/auth";
import type { RootState } from "../store"; // Import your store type

interface LoginResponse {
  user: User;
  token: string;
}

interface RefreshResponse {
  accessToken: string;
}

// 1️⃣ Base fetch with headers
const baseQuery = fetchBaseQuery({
  baseUrl: "https://jacelyn-undelineable-maynard.ngrok-free.dev/api",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Required for ngrok to bypass browser warning
    headers.set("ngrok-skip-browser-warning", "true");

    return headers;
  },
  credentials: "include", // send cookies (for refresh token)
});

// 2️⃣ Wrapper to handle 401 + refresh token
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check if we got 401 and it's not the refresh endpoint itself
  const isRefreshEndpoint =
    (typeof args === "string" ? args : args.url) === "/auth/refresh";

  if (result?.error && result.error.status === 401 && !isRefreshEndpoint) {
    try {
      // Attempt to refresh the access token
      const refreshResult = await baseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const data = refreshResult.data as RefreshResponse;

        if (data?.accessToken) {
          // Store new token
          api.dispatch(setToken(data.accessToken));

          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // No access token in response → logout
          api.dispatch(logout());
        }
      } else {
        // Refresh failed → logout
        api.dispatch(logout());
      }
    } catch (e) {
      console.error("Refresh token request failed:", e);
      api.dispatch(logout());
    }
  }

  return result;
};

// 3️⃣ API definition
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Subscriptions", "Login", "Logout", "Users"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: (body) => ({
          url: "/auth/login",
          method: "POST",
          body,
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            // Store token in Redux state
            dispatch(setToken(data.token));
          } catch (error) {
            console.error("Login failed:", error);
          }
        },
        invalidatesTags: ["Login"],
      },
    ),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout request failed:", error);
        } finally {
          // Always clear state, even if server request fails
          dispatch(api.util.resetApiState());
          dispatch(logout());
        }
      },
      invalidatesTags: ["Logout"],
    }),

    // Example: Protected endpoint
    getCurrentUser: builder.query<User, void>({
      query: () => "/auth/me",
    }),

    // Uncomment when ready
    // createSubscription: builder.mutation<
    //   any,
    //   { planId: number; addons?: number[] }
    // >({
    //   query: (body) => ({
    //     url: "/subscribe-test",
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["Subscriptions"],
    // }),

    getUsers: builder.query<void, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUsersQuery,
} = api;
