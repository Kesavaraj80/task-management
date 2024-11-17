// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  const data = { dummy: "test" };
  return Response.json(data);
}
