import { register, TVal } from "./DeXError";

const Messages: Record<string, string | TVal> = {
  // Misc
  FEATURE_TODO: `This feature is currently not implemented. It might be re-done eventually`,

  // Errors related to Extension Faults
  DISCORD_ERROR: err => err.message,
  API_ERROR: msg => msg,

  // Database Faults
  MONGODB_ERROR: err => `An unknown error occurred while interacting with MongoDB: ${err}`,
  DRIVER_ERROR: err => `An unknown error occurred within Driver: ${err}`,
  DRIVER_INVALID_PARAMS: `A Driver method was executed with insufficient or invalid parameters.`,
};

for (const [name, message] of Object.entries(Messages)) register(name, message);
