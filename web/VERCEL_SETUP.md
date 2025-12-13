# คู่มือการ Deploy ขึ้น Vercel (Vercel Deployment Guide)

ผมได้ปรับแก้โค้ดให้รองรับ **Vercel + PostgreSQL** เรียบร้อยแล้วครับ
ทำตามขั้นตอนง่ายๆ ดังนี้:

## 1. นำโค้ดขึ้น GitHub
1. สร้าง Repository ใหม่ใน GitHub ของคุณ
2. อัปโหลดโค้ดทั้งหมดขึ้นไป (หรือใช้ Git command line)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <URL_OF_YOUR_REPO>
   git push -u origin main
   ```

## 2. เชื่อมต่อกับ Vercel
1. ไปที่ [Vercel.com](https://vercel.com) และ Login
2. กด **"Add New..."** -> **"Project"**
3. เลือก Repository ที่คุณเพิ่งสร้างใน GitHub -> กด **Import**

## 3. ตั้งค่า Database (สำคัญ!)
1. ในหน้า Configure Project **อย่าเพิ่งกด Deploy** (หรือถ้ากดไปแล้วแล้ว Error ไม่เป็นไร)
2. ไปที่แท็บ **Storage** (ในหน้า Dashboard ของโปรเจกต์บน Vercel)
3. กด **Create Database** -> เลือก **Postgres** -> กด **Create**
4. ตั้งชื่อ (อะไรก็ได้) และเลือก Region (แนะนำ **Singapore** หรือใกล้ไทยที่สุด)
5. เมื่อสร้างเสร็จ ให้กด **Connect Project** และเลือกโปรเจกต์ของคุณ
   - ขั้นตอนนี้ Vercel จะเติม Environment Variables (`POSTGRES_PRISMA_URL` ฯลฯ) ให้โดยอัตโนมัติ

## 4. Deploy
1. ไปที่แท็บ **Deployments**
2. ถ้าการ Deploy ครั้งแรก Failed (เพราะยังไม่มี Database) ให้กด **Redeploy** (จุด 3 จุดขวาสุด -> Redeploy)
3. รอจนเสร็จ (สถานะเป็น Ready)

## 5. สร้างตารางใน Database (Migration)
เมื่อ Deploy ผ่านแล้ว เราต้องสั่งสร้างตารางใน Database จริง:
1. ในหน้า Dashboard ของ Vercel ไปที่แท็บ **Settings** -> **Environment Variables**
2. ตรวจสอบว่ามีค่าพวก `POSTGRES_PRISMA_URL` ขึ้นมาแล้ว
3. กลับมาที่เครื่องของคุณ (Local) เราจะสั่ง Migrate ข้อมูลขึ้น Cloud
   - คุณต้อง Login Vercel ในเครื่องก่อน (ถ้ายังไม่มีให้ลง `npm i -g vercel`)
   - รันคำสั่ง:
     ```bash
     vercel link
     ```
     (เลือกโปรเจกต์ให้ตรงกัน)
   - ดึงค่า Config จาก Cloud มาลงเครื่อง:
     ```bash
     vercel env pull .env.development.local
     ```
   - สั่งสร้างตารางบน Cloud:
     ```bash
     npx prisma migrate deploy
     ```
     (หรือ `npx prisma db push`)

## 6. เสร็จสิ้น!
ตอนนี้เว็บของคุณออนไลน์แล้ว และใช้ Database ของ Vercel Postgres

---

## หมายเหตุสำหรับการรันในเครื่อง (Local Development)
เนื่องจากเราเปลี่ยน Database เป็น Postgres แล้ว:
- **ถ้าคุณมีอินเทอร์เน็ต**: คุณสามารถรัน `npm run dev` ได้เลย ระบบจะไปต่อกับ Database บน Cloud (Vercel) ให้เอง (เพราะเราดึงไฟล์ `.env.development.local` มาแล้ว)
- **ข้อดี**: ข้อมูลในเครื่องกับบนเว็บจะตรงกัน
- **ข้อเสีย**: ต้องต่อเน็ตตลอดเวลา

ถ้าต้องการกลับมาใช้ SQLite ในเครื่อง ให้แก้ไฟล์ `prisma/schema.prisma` กลับเป็น `provider = "sqlite"` และแก้ `.env` ครับ (แต่ไม่แนะนำ เพราะจะสับสนเวลา Deploy)
