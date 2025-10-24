# Stage 1: Build the Application
FROM maven:3.8.7-eclipse-temurin-17 AS build
# Set the current working directory inside the container
WORKDIR /app
# Copy the Maven project files (pom.xml)
COPY pom.xml .
# Copy the source code
COPY src /app/src

# Run a full Maven clean package to build the executable JAR
RUN mvn clean package -DskipTests

# Stage 2: Create the Final Production Image
FROM eclipse-temurin:17-jre-focal
# Set the working directory for the final application
WORKDIR /app

# Copy the built JAR file from the 'build' stage
# Adjust the name 'weather-dashboard-backend-0.0.1-SNAPSHOT.jar'
# if your application name is different. Check your target folder after building.
COPY --from=build /app/target/*.jar app.jar

# Define the environment variable for the API Key
# The host MUST set this variable when running the container (e.g., in Render)

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
