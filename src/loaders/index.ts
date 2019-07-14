import loadCommands from "./loadCommands";
import loadEvents from "./loadEvents";
import connectSpamCache from "./connectSpamCache";
import connectDB from "./connectDB"

export default [loadEvents, loadCommands, connectSpamCache, connectDB];
