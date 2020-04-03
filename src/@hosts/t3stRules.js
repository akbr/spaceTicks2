export const initialState = { count: 0 };
export const rules = [
  {
    type: "add",
    resolve: state => {
      state.count += 1;
    }
  },
  {
    type: "boost",
    getActions: state => state.count === 10,
    resolve: state => {
      state.count += 100;
    }
  }
];
