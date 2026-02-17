import axios from "axios";
import { decodeCookieValue } from "../utils/decodeCookieValue";

async function executeMyAccountApi(body) {
  if (!body) {
    throw new Error("API body is required");
  }

  const sessionKeys = Object.keys(sessionStorage);
  const cookieKey = sessionKeys.find(k => k.startsWith("RDSD_"));
  if (!cookieKey) throw new Error("Session cookie not found");

  const decoded = decodeCookieValue(sessionStorage.getItem(cookieKey));
  if (!decoded) throw new Error("Failed to decode session");
  const { rptapiurl, YearCode, cuVer, SV } = decoded;
  if (!rptapiurl) throw new Error("API URL missing");

  const encodedYearCode = btoa(YearCode);

  try {
    const response = await axios.post(rptapiurl, body, {
      headers: {
        YearCode: encodedYearCode,
        version: cuVer,
        sv: SV,
        sp: "106",
      },
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.Message ||
      error?.response?.data ||
      error.message;

    throw new Error(message);
  }
}

export function getCloudStorageData(clientIp, LUId) {
    const body = {
      con: JSON.stringify({
        mode: "getUseData",
        appuserid: LUId,
        IPAddress: clientIp,
      }),
      p: "{}",
      f: "MyAccount ( gettoken )",
    };
  
    return executeMyAccountApi(body);
}

export function getMyAccountInfo(clientIp, LUId) {
    const body = {
      con: JSON.stringify({
        id: "",
        mode: "getInfo",
        appuserid: LUId,
        IPAddress: clientIp,
      }),
      p: "{}",
      f: "MyAccount ( gettoken )",
    };
  
    return executeMyAccountApi(body);
}

export function getRegisteredMobile(clientIp, LUId) {
  const body = {
    con: JSON.stringify({
      mode: "Get_Mobileno",
      appuserid: LUId,
      IPAddress: clientIp,
    }),
    p: "{}",
    f: "MyAccount ( gettoken )",
  };

  return executeMyAccountApi(body);
}

export function getAddonDetail(body) {
  return executeMyAccountApi(body);
}

export function updateProfile(body) {
  return executeMyAccountApi(body);
}

export function updateManagementInfo(body) {
    return executeMyAccountApi(body);
  }
  
export function updateTechInfo(body) {
    return executeMyAccountApi(body);
}
  
export function updateAccountInfo(body) {
    return executeMyAccountApi(body);
}

export function addIpSecurity(body) {
    return executeMyAccountApi(body);
}  

export function softDeleteIpSecurity(body) {
  return executeMyAccountApi(body);
}

export function generateOtp(body) {
  return executeMyAccountApi(body);
}

export function verifyOtp(body) {
  return executeMyAccountApi(body);
}

export function fullResetAccount(body) {
  return executeMyAccountApi(body);
}

export function clearTransactionAccount(body) {
  return executeMyAccountApi(body);
}