# คู่มือการ Deploy (Deployment Guide)

เนื่องจากโปรเจกต์นี้เป็น **Next.js แบบ Server-Side Rendering (SSR)** และมีการใช้ **Database (SQLite)** จึง**ไม่สามารถ**นำไปวางบน Hosting แบบ Static HTML ธรรมดาได้โดยตรง จำเป็นต้องใช้ Hosting ที่รองรับ **Node.js**

จากภาพที่คุณส่งมา (Ruk-Com Cloud / Web Hosting), มี 2 กรณีที่เป็นไปได้:

## กรณีที่ 1: Web Hosting (Shared Hosting) ที่มีเมนู Node.js
หากในหน้าจัดการ Hosting (DirectAdmin หรือ cPanel) ของคุณมีเมนู **"Setup Node.js App"** หรือ **"Node.js Selector"**:

1. **เตรียมไฟล์**:
   - รันคำสั่ง `npm run build` ในเครื่องของคุณ
   - คุณจะได้โฟลเดอร์ `.next`, `public`, `package.json`, `next.config.ts`, และโฟลเดอร์ `prisma`
   - **สำคัญ**: เนื่องจากเราใช้ `output: 'standalone'` (ตั้งค่าไว้ให้แล้ว) ให้เข้าไปที่โฟลเดอร์ `.next/standalone`
   - นำไฟล์ทั้งหมดใน `.next/standalone` ขึ้นไปวางบน Server (รวมถึงโฟลเดอร์ `public` และ `.next/static` ที่ต้อง copy ไปวางให้ถูกตำแหน่งตามโครงสร้าง)
   
   *วิธีที่ง่ายกว่าสำหรับ Shared Hosting*:
   - Upload ไฟล์โปรเจกต์ทั้งหมด (ยกเว้น `node_modules`, `.git`) ขึ้นไปบน Server
   - ไปที่เมนู Node.js บน Hosting
   - เลือกเวอร์ชัน Node.js (แนะนำ 18 หรือ 20)
   - สั่ง Install Dependencies (npm install) ผ่านหน้าเว็บ หรือผ่าน Terminal (SSH)
   - สั่ง Build (`npm run build`)
   - ตั้งค่า Startup File เป็น `server.js` (ถ้าใช้ standalone) หรือ `node_modules/next/dist/bin/next` และ argument `start`

2. **Database (SQLite)**:
   - ตรวจสอบว่าไฟล์ `prisma/dev.db` ถูกสร้างขึ้นแล้ว (ถ้ายังไม่มี ให้รัน `npx prisma migrate deploy` บน Server)
   - **ข้อควรระวัง**: อย่าลบไฟล์ `dev.db` ตอนอัปเดตเว็บเวอร์ชันใหม่ ไม่อย่างนั้นข้อมูลจะหาย

## กรณีที่ 2: Ruk-Com Cloud (PaaS / Jelastic) - **แนะนำ**
หากคุณใช้บริการ Cloud PaaS ของ Ruk-Com (Jelastic) จะง่ายกว่ามาก:

1. **สร้าง Environment**: เลือก **Node.js**
2. **Deployment**:
   - **วิธีที่ 1 (Upload Zip)**:
     - รัน `npm run build` ในเครื่อง
     - Zip ไฟล์โปรเจกต์ทั้งหมด (ยกเว้น `node_modules`)
     - Upload Zip ขึ้นไปที่ Dashboard
     - ระบบจะรัน `npm install` และ `npm start` ให้
   - **วิธีที่ 2 (Docker)**:
     - ผมได้เตรียมไฟล์ `Dockerfile` ไว้ให้แล้ว
     - คุณสามารถ Build Docker Image และ Deploy บน Cloud ได้เลย

## กรณีที่ 3: VPS (Virtual Private Server)
หากคุณเช่า VPS (Ubuntu/Debian):

1. **ติดตั้ง Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Upload ไฟล์**: ใช้ FileZilla หรือ SCP นำไฟล์ขึ้น Server

3. **รันคำสั่ง**:
   ```bash
   # ติดตั้ง dependencies
   npm install

   # สร้าง Database
   npx prisma generate
   npx prisma migrate deploy

   # Build
   npm run build

   # Start (ใช้ PM2 เพื่อให้รันตลอดเวลา)
   sudo npm install -g pm2
   pm2 start npm --name "agreement-app" -- start
   ```

## สิ่งที่ต้องแก้ไขก่อน Deploy
ในไฟล์ `.env` ของคุณ:
```
DATABASE_URL="file:./dev.db"
```
ตรวจสอบให้แน่ใจว่าบน Server มีไฟล์ `.env` นี้อยู่

---
**สรุป**: ลองเข้าไปเช็คในหน้า Dashboard ของ Ruk-Com ก่อนครับว่ามีเมนูเกี่ยวกับ **Node.js** หรือไม่ ถ้ามีให้ใช้วิธีที่ 1 แต่ถ้าเป็น Hosting แบบเก่าที่รองรับแค่ PHP อาจจะต้องขออัปเกรดหรือย้ายไปใช้ Cloud PaaS ของเขาแทนครับ
