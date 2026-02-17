import { decodeCookieValue } from "./decodeCookieValue";

export function devBootstrap() {
  if (process.env.NODE_ENV !== "development") return;

  const CN =
    "UkRTRF8yMDI2MDExMDA1MTYyNF8zNmM2MGUxZDI4NWQ0YTc1OGY2NDg0ZTRiYWVhMjNmZQ==";

  const cookieName =
    "RDSD_20260110051624_36c60e1d285d4a758f6484e4baea23fe";

  const cookieValue =
    `%7b%22tkn%22%3a%22OTA2NTQ3MTcwMDUzNTY1MQ%3d%3d%22%2c%22pid%22%3a18333%2c%22IsEmpLogin%22%3a0%2c%22IsPower%22%3a0%2c%22SpNo%22%3a%22MA%3d%3d%22%2c%22SpVer%22%3a%22%22%2c%22SV%22%3a%22MA%3d%3d%22%2c%22LId%22%3a%22MTE%3d%22%2c%22LUId%22%3a%22c3dhbWlAZWcuY29t%22%2c%22DAU%22%3a%22aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvQ2VudHJhbEFwaQ%3d%3d%22%2c%22YearCode%22%3a%22e3tuemVufX17ezIwfX17e29yYWlsMjV9fXt7b3JhaWwyNX19%22%2c%22cuVer%22%3a%22UjUwQjM%3d%22%2c%22rptapiurl%22%3a%22aHR0cDovL25ld25leHRqcy53ZWIvYXBpL3JlcG9ydA%3d%3d%22%7d`;

  const decodecookieValue = decodeCookieValue(cookieValue)
  sessionStorage.setItem('loginUser', JSON.stringify(decodecookieValue))
  sessionStorage.setItem(cookieName, cookieValue);
}
