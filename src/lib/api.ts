"use client";
import { AxiosError } from "axios";

export interface ErrorResponse {
  data: unknown | undefined; // undefined
  error: true;
  statusCode: 400 | 404 | 500 | number;
  errors?: {
    message: string;
    path: string[];
    type: string;
  }[][];
  message?: string;
}

export function handleAxiosError(error: unknown) {
  const axiosError = error as AxiosError<ErrorResponse>;
  const errorResponse: ErrorResponse = {
    data: undefined,
    error: true,
    statusCode: axiosError.response?.status || 500,
    errors: axiosError.response?.data?.errors,
    message:
      axiosError.response?.data.message ||
      axiosError.response?.data.errors?.[0]?.[0]?.message ||
      axiosError.message,
  };
  return Promise.reject(errorResponse);
}
