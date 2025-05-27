# Base image using Ubuntu 20.04 (focal)
FROM ubuntu:focal


# Install curl and dependencies, add NodeSource repo for Node.js 18.x,
# and install Node.js and FFmpeg
RUN /usr/bin/apt-get update && \
    /usr/bin/apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    /usr/bin/apt-get update && \
    /usr/bin/apt-get upgrade -y && \
    /usr/bin/apt-get install -y nodejs ffmpeg

# Set working directory inside the container
WORKDIR /home/app

# Use bash as the default entrypoint shell
ENTRYPOINT [ "bash" ]

#https://soham-streaming-setup.s3.ap-south-1.amazonaws.com/outputs/index.m3u8