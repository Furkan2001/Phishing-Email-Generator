FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["PhishingGenerator.csproj", "./"]
RUN dotnet restore "PhishingGenerator.csproj"

COPY . .

RUN dotnet publish "PhishingGenerator.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "PhishingGenerator.dll"]