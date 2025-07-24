#Базовый образ для runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8082

#Образ для сборки с Node.js и .NET SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Установка Node.js и SASS
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g sass

ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Insania.Web/", "."]

#Восстановление npm-зависимостей
RUN if [ -f "package.json" ]; then \
      npm install; \
    fi

#Восстановление .NET и компиляция SASS
RUN dotnet restore "Insania.Web.csproj" && \
    if [ -d "wwwroot/scss" ]; then \
      npm run build-css; \
    fi

#Сборка проекта
RUN dotnet build "Insania.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build

#Публикация
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Insania.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

#Финальный образ
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Insania.Web.dll"]