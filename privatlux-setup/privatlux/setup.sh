#!/bin/bash

echo "🚀 Setting up PrivatLux Website..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check version (should be >= 16)
        if node -pe "process.version.split('.')[0].slice(1) >= 16" &> /dev/null; then
            print_status "Node.js version is compatible"
        else
            print_error "Node.js version should be 16 or higher. Please upgrade."
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
}

# Check if MongoDB is installed or accessible
check_mongodb() {
    print_info "Checking MongoDB connection..."
    
    # Default MongoDB URI
    MONGO_URI="mongodb://localhost:27017/privatlux"
    
    echo "Please ensure MongoDB is running:"
    echo "- Local MongoDB: Start with 'mongod' command"
    echo "- MongoDB Atlas: Use your cloud connection string"
    echo ""
    print_warning "You'll need to update the .env file with your MongoDB URI"
}

# Install root dependencies
install_root_deps() {
    print_info "Installing root dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_status "Root dependencies installed successfully"
    else
        print_error "Failed to install root dependencies"
        exit 1
    fi
}

# Install backend dependencies
install_backend_deps() {
    print_info "Installing backend dependencies..."
    cd backend
    npm install
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    cd ..
}

# Install frontend dependencies
install_frontend_deps() {
    print_info "Installing frontend dependencies..."
    cd frontend
    npm install
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
}

# Setup environment files
setup_env_files() {
    print_info "Setting up environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_status "Created backend/.env from example"
        print_warning "Please edit backend/.env with your MongoDB URI and JWT secret"
    else
        print_info "Backend .env already exists"
    fi
    
    # Frontend .env.local
    if [ ! -f "frontend/.env.local" ]; then
        cp frontend/.env.local.example frontend/.env.local
        print_status "Created frontend/.env.local from example"
    else
        print_info "Frontend .env.local already exists"
    fi
}

# Create uploads directory
create_uploads_dir() {
    print_info "Creating uploads directory..."
    mkdir -p backend/uploads
    print_status "Uploads directory created"
}

# Display final instructions
show_final_instructions() {
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Configure your environment:"
    echo "   📝 Edit backend/.env with your MongoDB URI and JWT secret"
    echo "   💾 Example: MONGODB_URI=mongodb://localhost:27017/privatlux"
    echo "   🔑 Example: JWT_SECRET=your_super_secret_key_here"
    echo ""
    echo "2. Start the development servers:"
    echo "   🚀 Run: npm run dev"
    echo "   🌐 Frontend: http://localhost:3000"
    echo "   🔗 Backend: http://localhost:5000"
    echo ""
    echo "3. Test the application:"
    echo "   ✅ Visit http://localhost:3000 for the homepage"
    echo "   ✅ Visit http://localhost:3000/escorts for escort listings"
    echo "   ✅ Visit http://localhost:3000/login for authentication"
    echo ""
    echo "📚 For detailed instructions, see README.md"
    echo ""
    print_status "PrivatLux is ready for development!"
}

# Main execution
main() {
    echo ""
    print_info "Starting PrivatLux setup process..."
    echo ""
    
    check_node
    check_mongodb
    install_root_deps
    install_backend_deps
    install_frontend_deps
    setup_env_files
    create_uploads_dir
    show_final_instructions
}

# Run main function
main