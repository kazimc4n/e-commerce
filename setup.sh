#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Atez Software Technologies E-commerce Setup${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose not found. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}Docker and Docker Compose found${NC}"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}.env file created${NC}"
else
    echo -e "${YELLOW}.env file already exists${NC}"
fi

echo ""
echo -e "${BLUE}Starting Docker services...${NC}"

# Start Docker services
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Docker services started successfully${NC}"
else
    echo -e "${RED}Failed to start Docker services${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Waiting for database to be ready...${NC}"
sleep 10

echo -e "${BLUE}Installing dependencies...${NC}"

# Install server dependencies
echo -e "${YELLOW}Installing server dependencies...${NC}"
npm install

# Install client dependencies
echo -e "${YELLOW}Installing client dependencies...${NC}"
cd client && npm install && cd ..

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Dependencies installed successfully${NC}"
else
    echo -e "${RED}Failed to install dependencies${NC}"
fi

echo ""
echo -e "${BLUE}Seeding database with sample data...${NC}"

# Run database seeding
npm run db:seed

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database seeded successfully${NC}"
else
    echo -e "${YELLOW}Database seeding failed. You can run 'npm run db:seed' manually later.${NC}"
fi

echo ""
echo -e "${GREEN}Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Access points:${NC}"
echo -e "   ${YELLOW}Frontend:${NC} http://localhost"
echo -e "   ${YELLOW}Backend API:${NC} http://localhost:3001/api"
echo -e "   ${YELLOW}Health Check:${NC} http://localhost:3001/api/health"
echo ""
echo -e "${BLUE}Admin Credentials:${NC}"
echo -e "   ${YELLOW}Email:${NC} admin@atezsoftware.com"
echo -e "   ${YELLOW}Password:${NC} admin123"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo -e "   ${YELLOW}Stop services:${NC} npm run docker:down"
echo -e "   ${YELLOW}View logs:${NC} docker-compose logs -f"
echo -e "   ${YELLOW}Restart services:${NC} docker-compose restart"
echo -e "   ${YELLOW}Seed database:${NC} npm run db:seed"
echo ""
echo -e "${GREEN}Happy coding!${NC}" 