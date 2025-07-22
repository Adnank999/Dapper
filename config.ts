const config = {
  appName: "Dapper",
  appDescription:
    "",
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://quillminds.com",
};

export default config;
