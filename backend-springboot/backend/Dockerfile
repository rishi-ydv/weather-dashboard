# Stage 1: Build the Application
FROM maven:3.9.6-eclipse-temurin-21 AS build
# Define the API Key as a build argument (used only during the build stage)
ARG API_KEY
# Set the current working directory inside the container
WORKDIR /app
# Copy the Maven project files (pom.xml)
COPY pom.xml .
# Copy the source code
COPY src /app/src

# Run a full Maven clean package, passing the API_KEY as a system property
# to ensure the Spring context can be built without errors.
# We map the build argument API_KEY to the Spring property 'visualcrossing.api.key'.
RUN mvn clean package -DskipTests -Dvisualcrossing.api.key=${API_KEY}

# Stage 2: Create the Final Production Image
FROM eclipse-temurin:21-jre-jammy
# Set the working directory for the final application
WORKDIR /app

# Copy the built JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Define the environment variable for the API Key
# This key is read by the running application (runtime).
ENV OPENWEATHERMAP_API_KEY=${API_KEY}

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
