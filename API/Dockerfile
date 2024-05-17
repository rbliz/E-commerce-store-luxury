FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app
EXPOSE 8080

# copy csproj and restore as distinct layers. // ./ => this means copying to the workdir
COPY *.csproj ./ 
RUN dotnet restore

# copy everything else and build. //. ./ => this means to copy what's inside the physical folder we're in to the docker container /app/out
COPY . ./ 
RUN dotnet publish -c Release -o out 

# build a runtime image. // This is what we need to run our publishes app, not the sdk
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "API.dll"]


