FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

WORKDIR /app
EXPOSE 5000
EXPOSE 5001


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
RUN apt-get update -yq \
    && apt-get install -yq ca-certificates curl gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update -yq \
    && apt-get install nodejs -yq \
    && apt-get install -y nfs-common 

WORKDIR /src
COPY ["AutomateDroneApp.ServiceInterface/AutomateDroneApp.ServiceInterface.csproj", "AutomateDroneApp.ServiceInterface/"]
COPY ["AutomateDroneApp.ServiceModel/AutomateDroneApp.ServiceModel.csproj", "AutomateDroneApp.ServiceModel/"]
COPY ["AutomateDroneApp.Tests/AutomateDroneApp.Tests.csproj", "AutomateDroneApp.Tests/"]
COPY ["AutomateDroneApp/AutomateDroneApp.csproj", "AutomateDroneApp/"]
RUN dotnet restore "AutomateDroneApp/AutomateDroneApp.csproj"

COPY . .

WORKDIR "/src/AutomateDroneApp"
RUN npm install --global yarn
RUN yarn install
RUN dotnet build "AutomateDroneApp.csproj" -c Release -o /app/publish
#RUN dotnet publish "AutomateDroneApp.csproj" -c Release -o /app/publish
FROM build AS publish
WORKDIR /app/publish
ENTRYPOINT ["dotnet", "AutomateDroneApp.dll"  ]
