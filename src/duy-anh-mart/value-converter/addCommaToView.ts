function replaceAll(target: string, search, replacement) {
  return target.replace(new RegExp(search, "g"), replacement);
}

export class AddCommaToViewValueConverter {
  toView(numberValue: number) {
    return numberValue?.toLocaleString("en");
  }

  fromView(currentValue: string) {
    const replcaed = replaceAll(currentValue, ",", "");
    const result = Number(replcaed);
    if (Number.isNaN(result)) {
      return 0;
    }

    return result;
  }
}
