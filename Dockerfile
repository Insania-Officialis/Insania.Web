#Использование образа 9 dotnet
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

#Установка Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs
    npm install -g sass

#Задание рабочего каталога
WORKDIR /app

#Проброс порта
EXPOSE 8082

#Использование образа sdk 9 dotnet
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

#Создание переменной конфигурации сборки
ARG BUILD_CONFIGURATION=Release

#Задание рабочего каталога
WORKDIR /src

#Копирование файлов в контейнер
COPY ["Insania.Web", ""]

#Восстановление проекта
RUN dotnet restore "./Insania.Web.csproj"

#Компиляция SASS (если есть SCSS-файлы)
RUN if [ -d "wwwroot/scss" ]; then \
      sass wwwroot/scss/:wwwroot/css/ --style compressed; \
    fi

#Сборка проекта
RUN dotnet build "./Insania.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build

#Использование образа сборки для публикации
FROM build AS publish

#Создание переменной конфигурации сборки
ARG BUILD_CONFIGURATION=Release

#Публикация проекта
RUN dotnet publish "./Insania.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

#Использование базового образа для финальных действий
FROM base AS final

#Задание рабочего каталога
WORKDIR /app

#Копирование файлов публикации
COPY --from=publish /app/publish .

#Запуск приложения
ENTRYPOINT ["dotnet", "Insania.Web.dll"]