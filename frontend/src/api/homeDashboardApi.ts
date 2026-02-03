/**
 * Home Dashboard API Client
 * 
 * Single source of truth for the /api/home-dashboard endpoint.
 * 
 * Rules:
 * - No query parameters
 * - No response transformations
 * - Auth is handled globally by axios instance
 * 
 * ⚠️ DO NOT add sorting, filtering, or calculations here.
 */

import api from "./axios";
import type { HomeDashboard } from "../types/homeDashboard";

/**
 * Fetch the home dashboard data.
 * Returns backend response as-is without modification.
 */
export async function fetchHomeDashboard(): Promise<HomeDashboard> {
  const response = await api.get<HomeDashboard>("/home-dashboard");
  return response.data;
}
