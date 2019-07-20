import didYouMeanChecker from "didyoumean2";
import { TCommandMid } from "../../lib";

const didYouMean: TCommandMid = ({ didYouMean = null, msg, client }, next) => {
  if (!didYouMean) return next();
  let potentialCmd = didYouMeanChecker(didYouMean as string, client.commands.keys());
  if (!potentialCmd) return next();
  if (Array.isArray(potentialCmd)) potentialCmd = potentialCmd.join(", ");
  msg.channel.send(`Did you mean **${potentialCmd}** :question:`);
};

export default didYouMean;
