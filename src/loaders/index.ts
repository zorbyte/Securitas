import loadCommands from "./loadCommands";
import loadEvents from "./loadEvents";
import connectSpamCache from "./connectCache";
import connectDB from "./connectDB";

export default [connectDB, connectSpamCache, loadEvents, loadCommands];
