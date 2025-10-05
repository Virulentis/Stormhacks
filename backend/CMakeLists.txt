cmake_minimum_required(VERSION 3.10)
project(CardBackend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include all header files under include/
include_directories(${CMAKE_SOURCE_DIR}/include)

# Find hiredis
find_path(HIREDIS_INCLUDE_DIR hiredis/hiredis.h)
find_library(HIREDIS_LIB hiredis)

if (NOT HIREDIS_INCLUDE_DIR OR NOT HIREDIS_LIB)
    message(WARNING "hiredis not found — please install via 'brew install hiredis'")
else()
    message(STATUS "Found hiredis at: ${HIREDIS_LIB}")
endif()

# Find nlohmann_json (installed via brew or vcpkg)
find_package(nlohmann_json CONFIG REQUIRED)

# Add your source files
add_executable(server
    main.cpp
    src/service.cpp
    src/utils/RedisClient.cpp
)

# Link libraries
target_include_directories(server PRIVATE ${HIREDIS_INCLUDE_DIR})
target_link_libraries(server PRIVATE nlohmann_json::nlohmann_json ${HIREDIS_LIB})

# Include Homebrew system headers (required for Crow, ASIO, and Redis libraries on macOS)
include_directories(/opt/homebrew/include)