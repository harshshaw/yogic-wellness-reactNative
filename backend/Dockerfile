# ── Build stage ───────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Copy the POM alone first so dependency resolution stays cached when only
# source files change.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a non-root user — Cloud Run does not require it, but a container that
# never needs root shouldn't have it.
RUN addgroup -S karmana && adduser -S karmana -G karmana
USER karmana

COPY --from=build /build/target/karmana-backend-*.jar app.jar

# MaxRAMPercentage lets the heap track whatever memory the Cloud Run service is
# configured with instead of being pinned at image build time.
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
