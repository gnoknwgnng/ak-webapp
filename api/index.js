// Leap Cell static file handler
export const handler = async (event) => {
  // For static file requests, return the main HTML
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=/index.html">
    <title>Redirecting...</title>
</head>
<body>
    <p>Redirecting to WebSight Pro...</p>
</body>
</html>
    `
  };
};

export default handler;