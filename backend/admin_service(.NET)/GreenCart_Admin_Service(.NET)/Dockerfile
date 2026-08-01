FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["GreenCart_Admin_Service(.NET).csproj", "./"]
RUN dotnet restore "GreenCart_Admin_Service(.NET).csproj"
COPY . .
RUN dotnet publish "GreenCart_Admin_Service(.NET).csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5026
ENV ASPNETCORE_URLS=http://+:5026
ENTRYPOINT ["dotnet", "GreenCart_Admin_Service(.NET).dll"]
