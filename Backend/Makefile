# List of microservices and their respective ports
SERVICES = admins_service bikes_service rentals_service reviews_service users_service 
PORTS = 8001 8002 8003 8004 8005

# Build all microservices
build:
	@$(foreach service,$(SERVICES),docker build -t $(service) --build-arg SERVICE_PORT=$(word $(words $(subst _, ,$(service))),$(PORTS)) --file $(service)/Dockerfile . && true)

# Clean up images
clean:
	@$(foreach service,$(SERVICES),docker rmi -f $(service) && true)
