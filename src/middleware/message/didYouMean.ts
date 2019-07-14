import { TCommandMid } from "./";
import didYouMeanChecker from "didyoumean2";

const didYouMean: TCommandMid = (msg, ctx, next) => {
  if (!ctx.didYouMean) return next();
  let potetialCmd = didYouMeanChecker(ctx.didYouMean as string, Object.keys(ctx.client.commands));
  if (!potetialCmd) return next();
  if (Array.isArray(potetialCmd)) potetialCmd = potetialCmd.join(", ");
  msg.channel.send(`Did you mean **${potetialCmd}** :question:`);
};

export default didYouMean;
