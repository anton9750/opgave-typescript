export const gridModel = {
  currentCols: 5,
  
  options: [
    { cols: 5,  label: "5 per row",  maxWidth: "560px" },
    { cols: 8,  label: "8 per row",  maxWidth: "720px" },
    { cols: 11, label: "11 per row", maxWidth: "960px" }
  ],

  setCols(cols: number) {
    this.currentCols = cols;
  },

  getCurrentCols() {
    return this.currentCols;
  },

  getOptions() {
    return this.options;
  }
};