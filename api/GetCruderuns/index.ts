import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import cruderunService from "../services/cruderunsService";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const region = req.params.region;
    const cols = req.query.cols;

    const products = await cruderunService().read(region, cols);
    context.res = {
      status: 200,
      body: products,
    };
  } catch (err) {
    //TODO: all errors bubble up here. Add custom errors to ../services/cruderunsService.ts for things like 404 not found, etc
    context.res = {
      status: 500,
      body: getErrorMessage(err),
    };
  }
};

export default httpTrigger;
