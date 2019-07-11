import { performance } from "perf_hooks";

class Stopwatch {
  private start = performance.now();
  private stopped = false;
  private laps: number[] = [];

  public get(lapID: number, toFixed?: number) {
    const chosenLap = this.laps[lapID];
    if (!chosenLap) throw new RangeError(`Lap with ID ${lapID} does not exist!`);
    return this.toFixTime(toFixed, chosenLap);
  }

  private toFixTime(toFixedAmnt: number | undefined, time: number): number {
    return parseFloat(time.toFixed(toFixedAmnt));
  }

  public lap(toFixed?: number): number {
    if (this.stopped) throw new Error("Stopwatch has already been stopped.");
    const lapTime = performance.now() - this.start;
    this.laps.push(lapTime);
    return this.toFixTime(toFixed, lapTime);
  }

  public stop(toFixed?: number): number {
    const finishTime = this.lap(toFixed);
    this.stopped = true;
    return finishTime;
  }
}

export default Stopwatch;
