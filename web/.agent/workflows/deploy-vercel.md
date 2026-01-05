---
description: วิธีการ Deploy โปรเจ็ค Next.js + Prisma ขึ้น Vercel
---

# คู่มือการ Deploy ขึ้น Vercel

ทำตามขั้นตอนต่อไปนี้เพื่อนำเว็บไซต์ขึ้นใช้งานจริงบน Vercel:

## 1. นำ Code ขึ้น GitHub
หากคุณยังไม่ได้นำโค้ดขึ้น GitHub ให้สร้าง Repository ใหม่และ Push code ขึ้นไปก่อน:
1.  สร้าง Git Repository ใน GitHub
2.  รันคำสั่งใน Terminal:
    ```bash
    git init
    git add .
    git commit -m "Ready for deploy"
    git branch -M main
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```

## 2. สร้างโปรเจ็คใน Vercel
1.  ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2.  กด **"Add New..."** -> **"Project"**
3.  เลือก Repository ที่คุณเพิ่ง Push ขึ้นไป (Import)
4.  ในหน้า **Configure Project**:
    *   **Framework Preset**: Next.js (น่าจะเลือกให้อัตโนมัติ)
    *   **Root Directory**: ถ้าโค้ดอยู่ใน root (`./`) ก็ไม่ต้องแก้ แต่ถ้าอยู่ในโฟลเดอร์ `web` ให้เลือก `web`
    *   **Environment Variables**: _(ข้ามไปก่อน เดี๋ยว Vercel จะจัดการให้ตอนเพิ่ม Database)_
5.  กด **"Deploy"** (ครั้งแรกอาจจะพังเพราะยังไม่มี Database ไม่ต้องตกใจ)

## 3. เชื่อมต่อ Database (Vercel Postgres)
1.  เมื่อ Vercel สร้างโปรเจ็คเสร็จ (หรือถ้า Build Failed ให้กดเข้าไปที่หน้า Dashboard ของโปรเจ็คนั้น)
2.  ไปที่แถบ **"Storage"**
3.  กด **"Connect Store"** -> เลือก **"Postgres"** -> **"Create New"**
4.  ตั้งชื่อ Database (เช่น `agreement-db`) และเลือก Region (`Singapore` ใกล้ไทยสุด)
5.  กด **"Create"**
6.  หลังจากสร้างเสร็จ Vercel จะถามว่าให้เชื่อมต่อกับโปรเจ็คไหม ให้กด **"Connect"** (เลือก environments: Production, Preview, Development)
7.  Vercel จะเพิ่ม Environment Variables (`POSTGRES_PRISMA_URL`, etc.) ให้โดยอัตโนมัติ
8.  ไปที่แถบ **"Deployments"** -> กดปุ่ม **"Redeploy"** (3 จุดมุมขวาของ deployment ล่าสุด -> Redeploy) เพื่อให้ App รู้จัก Database

## 4. เตรียม Database Schema และข้อมูลเริ่มต้น (Seed)
เนื่องจาก Database บน Cloud ยังว่างเปล่า คุณต้องสร้างตารางและใส่ข้อมูล Template เริ่มต้น:

### วิธีที่ง่ายที่สุด: ทำผ่านเครื่อง Local (แนะนำ)
1.  ไปที่ Vercel Dashboard -> **Storage** -> เลือก Database ของคุณ
2.  ไปที่เมนู **".env.local"** -> กด **"Copy Snippet"** หรือ **"Show Secret"**
3.  นำค่า Environment Variables เหล่านั้นมาใส่ในไฟล์ `.env` ในเครื่องของคุณ (แทนที่ค่าเดิมชั่วคราว หรือสร้างไฟล์ใหม่)
    *   *ข้อควรระวัง: อย่า Commit ไฟล์ .env ที่มีรหัสผ่านจริงขึ้น GitHub*
4.  รันคำสั่งใน Terminal เครื่องคุณเพื่อสร้างตารางบน Cloud:
    ```bash
    npx prisma db push
    ```
5.  รันคำสั่งเพื่อใส่ข้อมูล Template เริ่มต้น (Lease, Agency, Buy/Sell, Reservation, Receipt):
    ```bash
    npm run setup-templates
    ```
    *(ตรวจสอบให้แน่ใจว่า script นี้ทำงานสำเร็จ)*

## 5. ทดสอบใช้งาน
1.  เปิด URL ที่ Vercel ให้มา (เช่น `your-project.vercel.app`)
2.  ลองเข้าใช้งานดูครับ

---
**หมายเหตุ:**
- หากมีการแก้ Schema ในอนาคต ให้รัน `npx prisma db push` จากเครื่อง local อีกครั้ง
- หากต้องการดูข้อมูลใน Database บน Cloud สามารถใช้ Prisma Studio: `npx prisma studio` (เมื่อ .env เชื่อมต่อกับ Cloud)
