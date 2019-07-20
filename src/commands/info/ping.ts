import { Command } from "../../lib";

const ping: Command = {
  name: "ping",
  aliases: ["p"],
  permission: 0,
  run({ msg, client, timer }) {
    const execTime = timer.lap(2);
    const pingTime = (client.ws.ping / 8) + parseFloat(execTime);
    msg.channel.send(`:ping_pong: The ping latency is **≈${pingTime.toFixed(2)}ms**.\n:stopwatch: The execution time was **≈${execTime}ms**.`);
  },
};

export default ping;
