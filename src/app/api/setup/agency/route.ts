
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const agencyContent = {
    title: "สัญญาแต่งตั้งนายหน้าแบบเปิด (Open Agency Agreement)",
    sections: [
        {
            id: "sec_info",
            title: "ข้อมูลสัญญาและทรัพย์สิน",
            fields: [
                { id: "contractDate", label: "วันที่ทำสัญญา", type: "date" },
                { id: "location", label: "สถานที่ทำสัญญา", type: "text" },
                { id: "lessor", label: "ชื่อ-นามสกุล เจ้าของทรัพย์", type: "text" },
                { id: "lessorId", label: "เลขบัตรประชาชน เจ้าของทรัพย์", type: "text" },
                { id: "lessorAddress", label: "ที่อยู่ เจ้าของทรัพย์", type: "textarea" },
                { id: "lessorPhone", label: "เบอร์โทรศัพท์ เจ้าของทรัพย์", type: "text" },
                { id: "propertyType", label: "ประเภททรัพย์", type: "text" },
                { id: "propertyLocation", label: "ที่ตั้งทรัพย์", type: "textarea" },
                { id: "endDate", label: "สิ้นสุดสัญญาในวันที่", type: "date" },
            ]
        },
        {
            id: "sec_sign",
            title: "ลายเซ็นและพยาน",
            fields: [
                { id: "lessorSignature", label: "ลายเซ็นเจ้าของทรัพย์", type: "image" },
                { id: "lesseeSignature", label: "ลายเซ็นนายหน้า", type: "image" },
                { id: "witness1Name", label: "ชื่อ-นามสกุล พยาน 1", type: "text" },
                { id: "witness1Signature", label: "ลายเซ็นพยาน 1", type: "image" },
                { id: "witness2Name", label: "ชื่อ-นามสกุล พยาน 2", type: "text" },
                { id: "witness2Signature", label: "ลายเซ็นพยาน 2", type: "image" },
            ]
        },
        {
            id: "sec_docs",
            title: "เอกสารแนบ",
            fields: [
                { id: "lessorIdImage", label: "รูปบัตรประชาชน เจ้าของทรัพย์", type: "image" },
                { id: "lesseeIdImage", label: "รูปบัตรประชาชน นายหน้า", type: "image" },
            ]
        }
    ],
    layout: `
    <div class="p-8 text-black font-[Cordia New] leading-relaxed relative" style="font-family: 'Cordia New', sans-serif; font-size: 16pt;">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
            <div></div> 
            <div class="text-right">
                <div class="mb-2">วันที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[100px] inline-block text-center">{{contractDate}}</span></div>
                <div>เขียนที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[200px] inline-block text-center">{{location}}</span></div>
            </div>
        </div>

        <div class="font-bold text-lg mb-6">สัญญาฉบับนี้ทําขึ้นระหว่าง</div>

        <!-- Owner Section -->
        <div class="mb-4">
            <div class="leading-loose">
                ชื่อ <span class="font-bold border-b border-dotted border-black px-2 min-w-[300px] inline-block text-center">{{lessor}}</span>
                เลขประจำตัวประชาชน <span class="font-bold border-b border-dotted border-black px-2 min-w-[200px] inline-block text-center">{{lessorId}}</span><br>
                ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[400px] inline-block text-center">{{lessorAddress}}</span> 
                โทร <span class="font-bold border-b border-dotted border-black px-2 min-w-[150px] inline-block text-center">{{lessorPhone}}</span><br>
                ซึ่งต่อไปนี้ในสัญญาเรียกว่า <strong>เจ้าของทรัพย์</strong>
            </div>
        </div>

        <!-- Agent Section (Fixed) -->
        <div class="mb-6">
            <div class="leading-loose">
                กับ <strong>นางนัยนา เวียงพล</strong> เลขประจำตัวประชาชน <strong>3700100535206</strong><br>
                ที่อยู่เลขที่ <strong>99/680 ม.ชลดาสุวรรณภูมิ ต.ศีรษะจรเข้น้อย อ.บางเสาธง จ.สมุทรปราการ</strong><br>
                โทร <strong>094-5261946</strong> ในสัญญานี้เรียกว่า <strong>นายหน้า</strong>
            </div>
        </div>

        <div class="mb-4">โดยที่ คู่สัญญาทั้งสองฝ่าย ตกลงกันดังนี้</div>

        <!-- Clauses -->
        <div class="space-y-4">
            <div>
                <strong>ข้อ 1 วัตถุประสงค์ของสัญญา</strong><br>
                เจ้าของทรัพย์ตกลงแต่งตั้งให้นายหน้าเป็นนายหน้าเพื่อเสนอขายและทำการตลาดอสังหาริมทรัพย์ดังต่อไปนี้:<br>
                <div class="pl-4 mt-2">
                    ประเภททรัพย์: <span class="font-bold border-b border-dotted border-black px-2 min-w-[200px] inline-block">{{propertyType}}</span><br>
                    ที่ตั้งทรัพย์: <span class="font-bold border-b border-dotted border-black px-2 min-w-[400px] inline-block">{{propertyLocation}}</span>
                </div>
                <div class="mt-2">นายหน้าตกลงดำเนินการหาผู้ซื้อ เจรจา ประสานงาน และให้ข้อมูลที่จำเป็นเพื่อให้การซื้อขายสำเร็จลุล่วง</div>
            </div>

            <div>
                <strong>ข้อ 2 ระยะเวลาของสัญญา</strong><br>
                สัญญานี้มีผลตั้งแต่วันที่ลงนาม และสิ้นสุดในวันที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[150px] inline-block text-center">{{endDate}}</span> หรือจนกว่าการซื้อขายจะแล้วเสร็จ ทั้งนี้สามารถต่ออายุโดยความยินยอมของทั้งสองฝ่ายเป็นลายลักษณ์อักษร
            </div>

            <div>
                <strong>ข้อ 3 ขอบเขตงานของนายหน้า</strong>
                <ul class="list-disc pl-8 mt-1 space-y-1">
                    <li>ทำการตลาดทรัพย์สินโดยใช้ช่องทางต่าง ๆ ตามความเหมาะสม</li>
                    <li>พาผู้สนใจเข้าชมทรัพย์สิน</li>
                    <li>ให้ข้อมูลราคา เงื่อนไข และข้อเท็จจริงเกี่ยวกับตลาด</li>
                    <li>ประสานงานการเจรจาระหว่างเจ้าของทรัพย์และผู้ซื้อ</li>
                    <li>ดูแลขั้นตอนตั้งแต่ข้อเสนอซื้อจนถึงวันโอนกรรมสิทธิ์</li>
                </ul>
            </div>

            <div>
                <strong>ข้อ 4 หน้าที่ของเจ้าของทรัพย์</strong>
                <ul class="list-disc pl-8 mt-1 space-y-1">
                    <li>เปิดเผยข้อมูลเกี่ยวกับทรัพย์สินตามความเป็นจริง</li>
                    <li>แจ้งสิทธิ ภาระผูกพัน หรือการจำนองที่เกี่ยวกับทรัพย์</li>
                    <li>ไม่ติดต่อหรือทำการตกลงโดยตรงกับผู้ซื้อและผู้ติดตามผู้ซื้อที่นายหน้าเป็นผู้แนะนำหรือพามาดูทรัพย์</li>
                    <li>ให้ความร่วมมือในการนัดหมายและจัดเตรียมเอกสารที่เกี่ยวข้อง</li>
                </ul>
            </div>

            <div>
                <strong>ข้อ 5 ค่าตอบแทนและค่าคอมมิชชั่น</strong><br>
                อัตราค่าคอมมิชชั่น: 3 % ของราคาซื้อขายจริง<br>
                ผู้ชำระค่าคอมมิชชั่น: เจ้าของทรัพย์<br>
                ค่าคอมมิชชั่นจะชำระ ณ วันโอนกรรมสิทธิ์หรือวันที่ทั้งสองฝ่ายตกลง
            </div>

            <div>
                <strong>ข้อ 6 กรณีเจ้าของทรัพย์ขายโดยตรงให้ผู้ซื้อที่นายหน้าแนะนำ</strong><br>
                หากเจ้าของทรัพย์ปิดการขายกับผู้ซื้อ/ผู้ติดตามที่นายหน้าเป็นผู้แนะนำ หรือผู้ซื้อ/ผู้ติดตามผู้ซื้อที่เคยเข้าชมทรัพย์ผ่านนายหน้า เจ้าของทรัพย์ตกลงชำระค่าคอมมิชชั่นตามอัตราที่กำหนดไว้ในสัญญานี้ แม้ว่าสัญญาจะหมดอายุแล้วก็ตาม
            </div>

            <div>
                <strong>ข้อ 7 การสิ้นสุดสัญญา</strong><br>
                สัญญานี้อาจสิ้นสุดก่อนกำหนดในกรณีใดกรณีหนึ่งดังต่อไปนี้:
                <ul class="list-disc pl-8 mt-1 space-y-1">
                    <li>คู่สัญญาตกลงยุติสัญญาเป็นลายลักษณ์อักษร</li>
                    <li>คู่สัญญาใดฝ่ายหนึ่งผิดสัญญาอย่างมีนัยสำคัญ</li>
                </ul>
            </div>

            <div>
                <strong>ข้อ 8 ข้อกำหนดทั่วไป</strong>
                <ul class="list-disc pl-8 mt-1 space-y-1">
                    <li>สัญญานี้อยู่ภายใต้กฎหมายไทย</li>
                    <li>การแก้ไขสัญญาต้องทำเป็นลายลักษณ์อักษรและลงนามโดยทั้งสองฝ่าย</li>
                </ul>
            </div>
        </div>

        <!-- Signatures -->
        <div class="mt-16 grid grid-cols-2 gap-12">
            <div class="text-center">
                <div class="mb-1">ลงชื่อ .......................................... เจ้าของทรัพย์</div>
                <div class="h-16 flex items-end justify-center relative">
                    <img src="{{lessorSignature}}" class="h-14 absolute bottom-0" style="display: {{lessorSignature ? 'block' : 'none'}}" />
                </div>
                <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{lessor}}</span> )</div>
                <div class="mt-1">ชื่อ-สกุล</div>
            </div>
            
            <div class="text-center">
                <div class="mb-1">ลงชื่อ .......................................... นายหน้า</div>
                <div class="h-16 flex items-end justify-center relative">
                    <img src="{{lesseeSignature}}" class="h-14 absolute bottom-0" style="display: {{lesseeSignature ? 'block' : 'none'}}" />
                </div>
                <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">นางนัยนา เวียงพล</span> )</div>
                <div class="mt-1">ชื่อ-สกุล</div>
            </div>
        </div>

        <div class="mt-12 grid grid-cols-2 gap-12">
            <div class="text-center">
                <div class="mb-1">ลงชื่อ .......................................... พยาน 1</div>
                <div class="h-16 flex items-end justify-center relative">
                     <img src="{{witness1Signature}}" class="h-14 absolute bottom-0" style="display: {{witness1Signature ? 'block' : 'none'}}" />
                </div>
                <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness1Name}}</span> )</div>
                <div class="mt-1">ชื่อ-สกุล</div>
            </div>
            
            <div class="text-center">
                <div class="mb-1">ลงชื่อ .......................................... พยาน 2</div>
                 <div class="h-16 flex items-end justify-center relative">
                     <img src="{{witness2Signature}}" class="h-14 absolute bottom-0" style="display: {{witness2Signature ? 'block' : 'none'}}" />
                </div>
                <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness2Name}}</span> )</div>
                <div class="mt-1">ชื่อ-สกุล</div>
            </div>
        </div>

        <!-- Attachments -->
         <div class="mt-12 break-before-page">
            <div class="mb-8">
                <div class="font-bold mb-4">บัตรประชาชนเจ้าของทรัพย์</div>
                <img src="{{lessorIdImage}}" class="w-full max-w-md object-contain border" style="display: {{lessorIdImage ? 'block' : 'none'}}; max-height: 400px;" />
            </div>
            
            <div>
                <div class="font-bold mb-4">บัตรประชาชนนายหน้า</div>
                <img src="{{lesseeIdImage}}" class="w-full max-w-md object-contain border" style="display: {{lesseeIdImage ? 'block' : 'none'}}; max-height: 400px;" />
            </div>
        </div>

    </div>
    `
};

export async function GET() {
    try {
        const existing = await prisma.contractTemplate.findFirst({
            where: { name: { contains: 'Open Agency' } }
        });

        if (existing) {
            await prisma.contractTemplate.update({
                where: { id: existing.id },
                data: {
                    content: JSON.stringify(agencyContent)
                }
            });
            return NextResponse.json({ message: 'Agency template updated' });
        } else {
            await prisma.contractTemplate.create({
                data: {
                    name: 'สัญญาแต่งตั้งนายหน้าแบบเปิด (Open Agency Agreement)',
                    content: JSON.stringify(agencyContent)
                }
            });
            return NextResponse.json({ message: 'Agency template created' });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
