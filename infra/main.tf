terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

# specify the provider region
provider "aws" {
  region = "ca-central-1"
}

# the locals block is used to declare constants that 
# you can use throughout your code
locals {
  save_function_name = "save-note-10156892"
  delete_function_name = "delete-note-10156892"
  get_function_name = "get-notes-10156892"
  handler_name  = "main.lambda_handler"
  save_artifact_name = "save_artifact.zip"
  delete_artifact_name = "delete_artifact.zip"
  get_artifact_name = "get_artifact.zip"
}

# create a role for the Lambda function to assume
# every service on AWS that wants to call other AWS services should first assume a role and
# then any policy attached to the role will give permissions
# to the service so it can interact with other AWS services
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "lambda-save" {
  name               = "iam-for-lambda-${local.save_function_name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "lambda-get" {
  name               = "iam-for-lambda-${local.get_function_name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "lambda-delete" {
  name               = "iam-for-lambda-${local.delete_function_name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# create archive file from main.py
data "archive_file" "lambda-save" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_file = "../functions/save-note/main.py"
  output_path =  "save_artifact.zip"

}

# create archive file from main.py
data "archive_file" "lambda-delete" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_file = "../functions/delete-note/main.py"
  output_path =  "delete_artifact.zip"

}

# create archive file from main.py
data "archive_file" "lambda-get" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_file = "../functions/get-notes/main.py"
  output_path =  "get_artifact.zip"

}


# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "save-note-10156892" {
  role             = aws_iam_role.lambda-save.arn
  function_name    = local.save_function_name
  handler          = local.handler_name
  filename         = local.save_artifact_name
  source_code_hash = data.archive_file.lambda-save.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}


# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "delete-note-10156892" {
  role             = aws_iam_role.lambda-delete.arn
  function_name    = local.delete_function_name
  handler          = local.handler_name
  filename         = local.delete_artifact_name
  source_code_hash = data.archive_file.lambda-delete.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}


# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "get-notes-10156892" {
  role             = aws_iam_role.lambda-get.arn
  function_name    = local.get_function_name
  handler          = local.handler_name
  filename         = local.get_artifact_name
  source_code_hash = data.archive_file.lambda-get.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs-save" {
  name        = "lambda-logging-${local.save_function_name}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": ["arn:aws:logs:*:*:*","${aws_dynamodb_table.lotion-30145288.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "logs-get" {
  name        = "lambda-logging-${local.get_function_name}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": ["arn:aws:logs:*:*:*","${aws_dynamodb_table.lotion-30145288.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "logs-delete" {
  name        = "lambda-logging-${local.delete_function_name}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": ["arn:aws:logs:*:*:*","${aws_dynamodb_table.lotion-30145288.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_logs_save" {
  role       = aws_iam_role.lambda-save.name
  policy_arn = aws_iam_policy.logs-save.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs_get" {
  role       = aws_iam_role.lambda-get.name
  policy_arn = aws_iam_policy.logs-get.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs_delete" {
  role       = aws_iam_role.lambda-delete.name
  policy_arn = aws_iam_policy.logs-delete.arn
}

# create a Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "url-save" {
  function_name      = aws_lambda_function.save-note-10156892.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "url-delete" {
  function_name      = aws_lambda_function.delete-note-10156892.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "url-get" {
  function_name      = aws_lambda_function.get-notes-10156892.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}
# show the Function URL after creation
output "lambda_url_save" {
  value = aws_lambda_function_url.url-save.function_url // ???
}

output "lambda_url_delete" {
  value = aws_lambda_function_url.url-delete.function_url // ???
}

output "lambda_url_get" {
  value = aws_lambda_function_url.url-get.function_url // ???
}

# read the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table
// USERS TABLE
resource "aws_dynamodb_table" "Users" {
  name         = "Users"
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  # we only need a student id to find an item in the table; therefore, we 
  # don't need a sort key here
  hash_key = "UID" // parition key
  range_key = "UID"

  # the hash_key data type is string
  attribute {
    name = "UID"
    type = "S"
  }

  attribute {
    name = "UID"
    type = "S"
  }
}

// ORDERS TABLE 
resource "aws_dynamodb_table" "Orders" {
  name         = "Orders"
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  # we only need a student id to find an item in the table; therefore, we 
  # don't need a sort key here
  hash_key = "OrderID" // parition key
  range_key = "OrderID"

  # the hash_key data type is string
  attribute {
    name = "OrderID"
    type = "S"
  }

  # attribute {
  #   name = "OrderID"
  #   type = "S"
  # }
}

// ENERGY LISTING TABLE
resource "aws_dynamodb_table" "EnergyListings" {
  name         = "EnergyListings"
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  # we only need a student id to find an item in the table; therefore, we 
  # don't need a sort key here
  hash_key = "ListingID" // parition key
  range_key = "ListingID"

  # the hash_key data type is string
  attribute {
    name = "ListingID"
    type = "S"
  }

  # attribute {
  #   name = "ListingID"
  #   type = "S"
  # }
}