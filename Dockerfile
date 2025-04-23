# 使用 Node.js 作为基础镜像
FROM node:20-alpine AS base

# 构建阶段
FROM base AS builder

# 设置工作目录
WORKDIR /app

# 首先只复制package.json和package-lock.json以利用缓存
COPY package.json package-lock.json* ./

# 复制prisma目录，确保schema.prisma文件在正确位置
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --force

# 只生成Prisma客户端，不连接数据库
RUN npx prisma generate

# 复制其余源代码
COPY . .

# 构建应用
RUN npm run build


# 生产阶段
FROM base AS runner

WORKDIR /app

# 创建一个非root用户并设置权限
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建好的应用和必要文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 复制启动脚本
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
# 暴露端口
EXPOSE 3000

# 设置启动命令，使用启动脚本
CMD ["./docker-entrypoint.sh"]