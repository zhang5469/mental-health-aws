# mental-health-aws
# Mental Health Screening Web Application

A cloud-based mental health screening web application developed as part of the **NEXT Program with The Cigna Group and the University of Connecticut**.

The application allows users to complete anxiety or depression screening questionnaires, receive a calculated score and severity interpretation, and access additional mental health resources.

## Features

* Anxiety and depression screening questionnaires
* Dynamic question rendering
* Response validation before submission
* Screening score calculation
* Severity interpretation based on the final score
* Progress tracking while completing a screening
* Mental health resource and provider information
* Responsive React user interface
* Serverless AWS backend

## Technologies

### Frontend

* React
* TypeScript
* Vite
* React Router
* CSS

### Backend / Cloud

* Amazon S3
* Amazon API Gateway
* AWS Lambda
* Amazon DynamoDB

### Development Tools

* Git
* GitHub
* AWS
* VS Code

## Architecture

The application uses a serverless AWS architecture.

```text
User
  |
  v
React + TypeScript Frontend
  |
  | HTTP GET Request
  v
Amazon API Gateway
  |
  v
AWS Lambda
  |
  v
Amazon DynamoDB
```

The frontend sends an API request containing the selected screening type.

For example:

```text
/questions/anxiety
```

API Gateway receives the request and triggers the Lambda function.

The Lambda function reads the screening type from the request and retrieves the corresponding questions from DynamoDB.

The questions are returned as JSON and displayed dynamically in the React frontend.

## Screening Workflow

```text
Select Screening
       |
       v
Answer Questions
       |
       v
Validate Responses
       |
       v
Calculate Score
       |
       v
Display Severity
       |
       v
View Resources / Next Steps
```

Users can select either an anxiety or depression screening.

The application tracks their answers and prevents submission until all required questions have been answered. After submission, the application calculates the total score and displays the corresponding severity level.

## DynamoDB Structure

Screening questions are stored in Amazon DynamoDB.

Each question contains information such as:

```json
{
  "testId": "ANXIETY",
  "questionId": "Q01",
  "order": 1,
  "text": "Example screening question",
  "options": [
    {
      "label": "Not at all",
      "score": 0
    },
    {
      "label": "Several days",
      "score": 1
    },
    {
      "label": "More than half the days",
      "score": 2
    },
    {
      "label": "Nearly every day",
      "score": 3
    }
  ]
}
```

The application currently supports separate question sets for:

* Anxiety
* Depression

The architecture can also support additional screening types by adding new questionnaire data to DynamoDB.

## Project Structure

```text
src/
├── components/
├── pages/
│   ├── Home
│   ├── Screening
│   ├── ScreeningQuestions
│   ├── Providers
│   ├── Resources
│   ├── CrisisSupport
│   └── AboutUs
├── App.tsx
└── main.tsx
```

## Running the Project Locally

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project directory:

```bash
cd <project-folder>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally run at:

```text
http://localhost:5173
```

## Build for Production

Create a production build with:

```bash
npm run build
```

Vite will generate the production files inside:

```text
dist/
```

These files can be deployed to a static hosting service such as Amazon S3.

## My Contributions

My primary responsibility was developing the **mental health screening feature**.

My contributions included:

* Building the screening selection and questionnaire pages with React and TypeScript
* Implementing dynamic question rendering based on the selected screening type
* Implementing answer tracking and submission validation
* Calculating screening scores and displaying severity interpretations
* Designing and populating DynamoDB questionnaire data
* Connecting the frontend to API Gateway and AWS Lambda
* Building Lambda logic to retrieve screening questions from DynamoDB
* Deploying the React frontend using Amazon S3
* Collaborating with teammates, Cigna engineers, and mentors throughout the NEXT Program

## Team and Program

This project was developed during the **NEXT Program**, in collaboration with **The Cigna Group engineers and mentors** and students from the **University of Connecticut**.

The project provided hands-on experience with:

* Cloud application development
* Serverless AWS architecture
* REST API integration
* React development
* Team-based software development
* Git and GitHub workflows
* Agile development practices

## Disclaimer

This application was created for educational and demonstration purposes.

The screening results provided by this application are **not a medical diagnosis** and should not replace evaluation or treatment from a qualified healthcare professional.

If you or someone you know is experiencing a mental health emergency, contact appropriate emergency or crisis services.

## License

This project was developed for educational purposes as part of the NEXT Program.
