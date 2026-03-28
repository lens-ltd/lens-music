/* Mirrors `api/src/constants/permission.constants.ts` — use for sidebar and client checks. */
// Combined Permissions Enum
export enum PERMISSIONS {
  // User permissions
  CREATE_USER = "CREATE_USER",
  READ_USER = "READ_USER",
  UPDATE_USER = "UPDATE_USER",

  // Release permissions
  CREATE_RELEASE = "CREATE_RELEASE",
  READ_RELEASE = "READ_RELEASE",
  UPDATE_RELEASE = "UPDATE_RELEASE",

  // Contributor permissions
  CREATE_CONTRIBUTOR = "CREATE_CONTRIBUTOR",
  READ_CONTRIBUTOR = "READ_CONTRIBUTOR",
  UPDATE_CONTRIBUTOR = "UPDATE_CONTRIBUTOR",
  DELETE_CONTRIBUTOR = "DELETE_CONTRIBUTOR",
  VERIFY_CONTRIBUTOR = "VERIFY_CONTRIBUTOR",
}
