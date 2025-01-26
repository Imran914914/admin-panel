import apiClient from "../Api/ApiClient";

export const ThemeChanger = (value: any) => async (dispatch: any) => {
  console.log('theme changer got called')
  dispatch({
    type: "ThemeChanger",
    payload: value,
  });
};

