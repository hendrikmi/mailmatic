import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dotenv from "dotenv";

dotenv.config();

export class MailmaticInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, "BaseLayer", {
      code: lambda.Code.fromAsset("lambda_base_layer/layer.zip"),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7],
    });

    const apiLambda = new lambda.Function(this, "MailMaticapiFunction", {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.fromAsset("../app/"),
      handler: "mailmatic_api.handler",
      timeout: Duration.seconds(8),
      layers: [layer],
      environment: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
      },
    });

    const api = new apigateway.RestApi(this, "RestApi", {
      restApiName: "MailMatic API",
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["GET"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    const proxy = api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(apiLambda),
      anyMethod: false,
    });

    const method = proxy.addMethod("GET", undefined, { apiKeyRequired: true });

    const plan = api.addUsagePlan("UsagePlan", {
      name: "limited",
      throttle: {
        rateLimit: 1, // number of allowed requests per second
        burstLimit: 1, // number of requests your API can handle concurrently
      },
      quota: {
        limit: 1000,
        period: apigateway.Period.DAY,
      },
    });

    const key = api.addApiKey("ApiKey", {
      apiKeyName: "lowest-rate-limit",
    });
    plan.addApiKey(key);

    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
        {
          method: method,
          throttle: {
            rateLimit: 1,
            burstLimit: 1,
          },
        },
      ],
    });
  }
}

// https://devpost.hashnode.dev/aws-cdk-101-api-gateway-construct-throttle-quota-usageplans-api-keys#heading-quota-limit
// Add CORS: https://bobbyhadz.com/blog/add-cors-api-aws-cdk
