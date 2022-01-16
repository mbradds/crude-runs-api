import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import cruderunService from "../services/cruderunsService";

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
    context.res = {
      status: 500,
      body: JSON.stringify(err),
    };
  }
};

export default httpTrigger;
