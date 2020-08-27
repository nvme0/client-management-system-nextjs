import * as yup from "yup";

export const configuration = {
  isDev: process.env.NODE_ENV === "development",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_AGE_S: Number(process.env.JWT_REFRESH_AGE_S!),
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL!
};

export const validationSchema = yup.object().shape({
  isDev: yup.boolean().required(),
  JWT_ACCESS_SECRET: yup.string().required(),
  JWT_REFRESH_AGE_S: yup.number().required(),
  AUTH_SERVICE_URL: yup.string().required()
});
