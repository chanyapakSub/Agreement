
import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

const DEFAULT_AGENCY_SECTIONS = [
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
            { id: "lessorSignature", label: "ลายเซ็นเจ้าของทรัพย์", type: "signature" },
            { id: "lesseeSignature", label: "ลายเซ็นนายหน้า", type: "signature" },
            { id: "witness1Name", label: "ชื่อ-นามสกุล พยาน 1", type: "text" },
            { id: "witness1Signature", label: "ลายเซ็นพยาน 1", type: "signature" },
            { id: "witness2Name", label: "ชื่อ-นามสกุล พยาน 2", type: "text" },
            { id: "witness2Signature", label: "ลายเซ็นพยาน 2", type: "signature" },
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
];

const DEFAULT_AGENCY_LAYOUT = `<div class="p-[20mm] md:p-[25mm] text-black font-[Cordia New] leading-relaxed relative" style="font-family: 'Cordia New', sans-serif; font-size: 16pt;">
    
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
        <div class="w-1/3">
             <img src="/logo_PL_property.png" alt="PL Property" class="h-20 object-contain" />
        </div> 
        <div class="text-right w-2/3">
            <div class="mb-2">วันที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[100px] inline-block text-center">{{contractDate}}</span></div>
            <div>เขียนที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[200px] inline-block text-center">{{location}}</span></div>
        </div>
    </div>

    <div class="font-bold text-lg mb-6 text-center">สัญญาแต่งตั้งนายหน้าแบบเปิด</div>

    <div class="mb-4 text-justify">
        สัญญาฉบับนี้ทําขึ้นระหว่าง<br/>
        ชื่อ <span class="font-bold border-b border-dotted border-black px-2">{{lessor}}</span>
        เลขประจำตัวประชาชน <span class="font-bold border-b border-dotted border-black px-2">{{lessorId}}</span><br/>
        ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{lessorAddress}}</span> 
        โทร <span class="font-bold border-b border-dotted border-black px-2">{{lessorPhone}}</span><br/>
        ซึ่งต่อไปนี้ในสัญญาเรียกว่า <strong>เจ้าของทรัพย์</strong>
    </div>

    <div class="mb-4 text-justify">
        กับ <strong>นางนัยนา เวียงพล</strong> เลขประจำตัวประชาชน <strong>3700100535206</strong><br/>
        ที่อยู่เลขที่ <strong>99/680 ม.ชลดาสุวรรณภูมิ ต.ศีรษะจรเข้น้อย อ.บางเสาธง จ.สมุทรปราการ</strong><br/>
        โทร <strong>094-5261946</strong> ในสัญญานี้เรียกว่า <strong>นายหน้า</strong>
    </div>

    <div class="mb-4">โดยที่ คู่สัญญาทั้งสองฝ่าย ตกลงกันดังนี้</div>

    <div class="space-y-4 text-justify">
        <div>
            <strong>ข้อ 1 วัตถุประสงค์ของสัญญา</strong><br/>
            เจ้าของทรัพย์ตกลงแต่งตั้งให้นายหน้าเป็นนายหน้าเพื่อเสนอขายและทำการตลาดอสังหาริมทรัพย์ดังต่อไปนี้:<br/>
            <div class="pl-4 mt-2">
                ประเภททรัพย์: <span class="font-bold border-b border-dotted border-black px-2">{{propertyType}}</span><br/>
                ที่ตั้งทรัพย์: <span class="font-bold border-b border-dotted border-black px-2">{{propertyLocation}}</span>
            </div>
            <div class="mt-2">นายหน้าตกลงดำเนินการหาผู้ซื้อ เจรจา ประสานงาน และให้ข้อมูลที่จำเป็นเพื่อให้การซื้อขายสำเร็จลุล่วง</div>
        </div>

        <div>
            <strong>ข้อ 2 ระยะเวลาของสัญญา</strong><br/>
            สัญญานี้มีผลตั้งแต่วันที่ลงนาม และสิ้นสุดในวันที่ <span class="font-bold border-b border-dotted border-black px-2">{{endDate}}</span> หรือจนกว่าการซื้อขายจะแล้วเสร็จ ทั้งนี้สามารถต่ออายุโดยความยินยอมของทั้งสองฝ่ายเป็นลายลักษณ์อักษร
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
            <strong>ข้อ 5 ค่าตอบแทนและค่าคอมมิชชั่น</strong><br/>
            อัตราค่าคอมมิชชั่น: 3 % ของราคาซื้อขายจริง<br/>
            ผู้ชำระค่าคอมมิชชั่น: เจ้าของทรัพย์<br/>
            ค่าคอมมิชชั่นจะชำระ ณ วันโอนกรรมสิทธิ์หรือวันที่ทั้งสองฝ่ายตกลง
        </div>

        <div>
            <strong>ข้อ 6 กรณีเจ้าของทรัพย์ขายโดยตรงให้ผู้ซื้อที่นายหน้าแนะนำ</strong><br/>
            หากเจ้าของทรัพย์ปิดการขายกับผู้ซื้อ/ผู้ติดตามที่นายหน้าเป็นผู้แนะนำ หรือผู้ซื้อ/ผู้ติดตามผู้ซื้อที่เคยเข้าชมทรัพย์ผ่านนายหน้า เจ้าของทรัพย์ตกลงชำระค่าคอมมิชชั่นตามอัตราที่กำหนดไว้ในสัญญานี้ แม้ว่าสัญญาจะหมดอายุแล้วก็ตาม
        </div>

        <div>
            <strong>ข้อ 7 การสิ้นสุดสัญญา</strong><br/>
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
    <div class="mt-12 grid grid-cols-2 gap-8 break-inside-avoid">
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... เจ้าของทรัพย์</div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lessorSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lessorSignature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{lessor}}</span> )</div>
            <div class="mt-1">ชื่อ-สกุล</div>
        </div>
        
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... นายหน้า</div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lesseeSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lesseeSignature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">นางนัยนา เวียงพล</span> )</div>
            <div class="mt-1">ชื่อ-สกุล</div>
        </div>
    </div>

    <div class="mt-8 grid grid-cols-2 gap-8 break-inside-avoid">
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... พยาน 1</div>
            <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness1Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness1Signature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness1Name}}</span> )</div>
            <div class="mt-1">ชื่อ-สกุล</div>
        </div>
        
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... พยาน 2</div>
                <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness2Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness2Signature ? 'block' : 'none'}}" />
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

</div>`;

const DEFAULT_BUY_SECTIONS = [
    {
        id: "sec_info",
        title: "ข้อมูลสัญญา",
        fields: [
            { id: "contractDate", label: "วันที่ทำสัญญา", type: "date" },
            { id: "location", label: "สถานที่ทำสัญญา", type: "text" },
            { id: "transferDate", label: "กำหนดวันโอนกรรมสิทธิ์", type: "date" },
        ]
    },
    {
        id: "sec_parties",
        title: "คู่สัญญา",
        fields: [
            { id: "lessor", label: "ชื่อผู้จะขาย", type: "text" },
            { id: "lessorId", label: "เลขบัตรประชาชน ผู้จะขาย", type: "text" },
            { id: "lessorAddress", label: "ที่อยู่ ผู้จะขาย", type: "textarea" },
            { id: "lessee", label: "ชื่อผู้จะซื้อ", type: "text" },
            { id: "lesseeId", label: "เลขบัตรประชาชน ผู้จะซื้อ", type: "text" },
            { id: "lesseeAddress", label: "ที่อยู่ ผู้จะซื้อ", type: "textarea" },
        ]
    },
    {
        id: "sec_property",
        title: "ทรัพย์สินและราคา",
        fields: [
            { id: "propertyDetail", label: "รายละเอียดทรัพย์สิน (เช่น บ้านเลขที่, ประเภท)", type: "textarea" },
            { id: "titleDeedId", label: "เลขที่โฉนด", type: "text" },
            { id: "propertyLocation", label: "ที่ตั้งทรัพย์สิน", type: "textarea" },
            { id: "totalPrice", label: "ราคารวม (ตัวเลข)", type: "number" },
            { id: "depositAmount", label: "เงินมัดจำ (ตัวเลข)", type: "number" },
            { id: "remainingAmount", label: "เงินส่วนที่เหลือ (ตัวเลข)", type: "number" },
        ]
    },
    {
        id: "sec_sign",
        title: "ลายเซ็น",
        fields: [
            { id: "lessorSignature", label: "ลายเซ็นผู้จะขาย", type: "signature" },
            { id: "lesseeSignature", label: "ลายเซ็นผู้จะซื้อ", type: "signature" },
            { id: "witness1Name", label: "ชื่อพยาน 1", type: "text" },
            { id: "witness1Signature", label: "ลายเซ็นพยาน 1", type: "signature" },
            { id: "witness2Name", label: "ชื่อพยาน 2", type: "text" },
            { id: "witness2Signature", label: "ลายเซ็นพยาน 2", type: "signature" },
        ]
    }
];

const DEFAULT_BUY_LAYOUT = `<div class="p-[20mm] md:p-[25mm] text-black font-[Cordia New] leading-relaxed relative" style="font-family: 'Cordia New', sans-serif; font-size: 16pt;">
    
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
        <div class="w-1/3">
             <img src="/logo_PL_property.png" alt="PL Property" class="h-20 object-contain" />
        </div> 
        <div class="text-center w-1/3">
             <div class="font-bold text-xl">สัญญาจะซื้อจะขาย</div>
        </div>
        <div class="w-1/3"></div>
    </div>

    <div class="text-right mb-4">
        <div>ทำที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[150px] inline-block text-center">{{location}}</span></div>
        <div>วันที่ <span class="font-bold border-b border-dotted border-black px-2 min-w-[150px] inline-block text-center">{{contractDate}}</span></div>
    </div>

    <div class="mb-4 text-justify">
        สัญญาฉบับนี้ทำขึ้นระหว่าง <span class="font-bold border-b border-dotted border-black px-2">{{lessor}}</span>
        บัตรประชาชนเลขที่ <span class="font-bold border-b border-dotted border-black px-2">{{lessorId}}</span><br/>
        ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{lessorAddress}}</span><br/>
        ซึ่งต่อไปในสัญญานี้จะเรียกว่า “ผู้จะขาย” ฝ่ายหนึ่ง
    </div>

    <div class="mb-4 text-justify">
        กับ <span class="font-bold border-b border-dotted border-black px-2">{{lessee}}</span>
        บัตรประชาชนเลขที่ <span class="font-bold border-b border-dotted border-black px-2">{{lesseeId}}</span><br/>
        ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{lesseeAddress}}</span><br/>
        ซึ่งต่อไปในสัญญานี้เรียกว่า “ผู้จะซื้อ” อีกฝ่ายหนึ่ง
    </div>

    <div class="mb-4">คู่สัญญาทั้งสองฝ่ายตกลงทำสัญญาจะซื้อจะขายกัน โดยมีเงื่อนไขรายละเอียดดังต่อไปนี้</div>

    <div class="space-y-4 text-justify">
        <div>
            <strong>ข้อ 1.</strong> ผู้จะขายได้ตกลงที่จะขาย <span class="font-bold border-b border-dotted border-black px-2">{{propertyDetail}}</span>
            โฉนดเลขที่ <span class="font-bold border-b border-dotted border-black px-2">{{titleDeedId}}</span>
            ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2">{{propertyLocation}}</span><br/>
            ในราคารวม <span class="font-bold border-b border-dotted border-black px-2">{{totalPrice}}</span> บาท ( <span class="font-bold border-b border-dotted border-black px-2">{{totalPrice:thai}}</span> )<br/>
            โดยทั้งสองฝ่ายตกลงจะไปทำการโอนกรรมสิทธิ์ทรัพย์สินภายในไม่เกินวันที่ <span class="font-bold border-b border-dotted border-black px-2">{{transferDate}}</span>
        </div>

        <div>
            <strong>ข้อ 2.</strong> ในวันนี้ผู้จะขายได้รับเงินค่าวางมัดจำไว้แล้วเป็นเงิน <span class="font-bold border-b border-dotted border-black px-2">{{depositAmount}}</span> บาท ( <span class="font-bold border-b border-dotted border-black px-2">{{depositAmount:thai}}</span> )<br/>
             ส่วนที่เหลือผู้จะซื้อตกลงจะชำระให้แก่ผู้ขายทั้งหมดในวันที่โอนกรรมสิทธิ์ตามข้อ 1
        </div>

        <div>
            <strong>ข้อ 3.</strong> ค่าธรรมเนียมโอน ค่าอากรสแตมป์ ในรายการจดทะเบียนโอนกรรมสิทธิ์นี้ ทั้งสองฝ่าย ตกลงให้ฝ่ายผู้ซื้อ และฝ่ายผู้ขาย ชำระฝ่ายละครึ่ง และภาษีเงินได้ผู้ขายเป็นฝ่ายชำระ
        </div>

        <div>
            <strong>ข้อ 4.</strong> ผู้จะขายรับรองว่ามีสิทธิ์ในการขายทรัพย์สินโดยสมบูรณ์ เเละรับรองว่าทรัพย์สินปราศจากการรอนสิทธิ ภาระจำยอม หรือสิทธิเรียกร้องใดๆ และหากยังมีหนี้สินได้ติดพันอยู่ ผู้จะขายจะต้องรับผิดชอบชำระให้เสร็จก่อน หรือภายในวันโอนกรรมสิทธิ
        </div>

        <div>
            <strong>ข้อ 5.</strong> ถ้าผู้จะซื้อผิดสัญญาไม่ไปรับโอนตามกำหนดเวลาในข้อ 1. ให้ถือว่า ผู้จะซื้อผิดสัญญาและยินยอมให้ผู้จะขายริบมัดจำที่ชำระแล้วได้ทั้งหมด โดยผู้จะขายไม่จำเป็น ต้องบอกกล่าว และสัญญานี้เป็นอันยกเลิก แต่หากผู้จะขายทำผิดสัญญา ผู้จะขายยินยอมคืนมัดจำทั้งหมดที่ได้รับมาให้แก่ผู้ซื้อ และยอมเสียค่าปรับให้ผู้ซื้อเป็นเงินอีก 1 เท่าของเงินมัดจำ และยินยอมให้ผู้จะซื้อฟ้องศาลบังคับให้ปฏิบัติตามสัญญานี้อีกส่วนหนึ่งด้วย
        </div>

        <div>
            <strong>ข้อ 6.</strong> สัญญาฉบับนี้มีผลผูกพันทายาท และหรือ ผู้สืบสิทธิ์ ของทั้งสองฝ่ายด้วย
        </div>

        <div>
            <strong>ข้อ 7.</strong> ในกรณีที่มีความตกลงอื่นใดที่นอกเหนือจากข้อตกลงในสัญญาฉบับนี้แล้ว และข้อตกลงใหม่ที่จะดำเนินความตกลงกันนั้นไม่เป็นการขัดหรือแย้งกับข้อตกลงเดิม คู่สัญญาทั้งสองฝ่ายให้สัญญาว่าจะทำบันทึกข้อตกลงไว้เป็นลายลักษณ์อักษรลงลายมือชื่อทั้งสองฝ่ายแนบท้ายสัญญาฉบับนี้ และบันทึกข้อตกลงดังกล่าวที่แนบไว้ท้ายสัญญาให้ถือเป็นส่วนหนึ่งของสัญญาฉบับนี้ด้วย
        </div>
        
        <div class="mt-4">
            สัญญาฉบับนี้ถูกทำขึ้นเป็นฉบับมีข้อความถูกต้องตรงกัน คู่สัญญาทั้งสองฝ่ายได้อ่านข้อความและเข้าใจสัญญาดีแล้ว จึงลงลายมือชื่อไว้เป็นหลักฐานต่อหน้าพยานและยึดถือไว้ฝ่ายละฉบับ
        </div>
    </div>

    <!-- Signatures -->
    <div class="mt-16 grid grid-cols-2 gap-12 break-inside-avoid">
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... ผู้จะขาย</div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lessorSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lessorSignature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{lessor}}</span> )</div>
        </div>
        
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... ผู้จะซื้อ</div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lesseeSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lesseeSignature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{lessee}}</span> )</div>
        </div>
    </div>

    <div class="mt-12 grid grid-cols-2 gap-12 break-inside-avoid">
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... พยาน</div>
            <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness1Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness1Signature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness1Name}}</span> )</div>
        </div>
        
        <div class="text-center">
            <div class="mb-1">ลงชื่อ .......................................... พยาน</div>
                <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness2Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness2Signature ? 'block' : 'none'}}" />
            </div>
            <div>( <span class="inline-block min-w-[200px] border-b border-dotted border-black">{{witness2Name}}</span> )</div>
        </div>
    </div>

</div>`;

const DEFAULT_RESERVATION_SECTIONS = [
    {
        id: "sec_project",
        title: "ข้อมูลโครงการและห้องชุด",
        fields: [
            { id: "projectName", label: "ชื่อโครงการ", type: "text" },
            { id: "projectLocation", label: "ที่ตั้ง", type: "textarea" },
            { id: "roomType", label: "ประเภทห้อง", type: "text" },
            { id: "roomSize", label: "ขนาด (ตร.ม.)", type: "text" },
            { id: "roomFloor", label: "ชั้น", type: "text" },
            { id: "furniture", label: "เฟอร์นิเจอร์", type: "textarea" },
            { id: "appliances", label: "เครื่องใช้ไฟฟ้า", type: "textarea" },
        ]
    },
    {
        id: "sec_payment",
        title: "รายละเอียดค่าใช้จ่ายและสัญญา",
        fields: [
            { id: "monthlyRent", label: "ค่าเช่าต่อเดือน", type: "number" },
            { id: "securityDeposit", label: "ค่าประกัน", type: "number" },
            { id: "totalBeforeMoveIn", label: "รวมชำระก่อนเข้าอยู่", type: "number" },
            { id: "contractTerm", label: "ระยะสัญญา", type: "text" },
            { id: "contractStartDate", label: "วันเริ่มสัญญา", type: "date" },
            { id: "moveInDate", label: "เข้าอยู่ได้ตั้งแต่", type: "date" },
            { id: "notes", label: "เงื่อนไขเพิ่มเติม", type: "textarea" }, // Default: ห้ามเลี้ยงสัตว์, ห้ามสูบบุหรี่
        ]
    },
    {
        id: "sec_reservation",
        title: "การจองและการชำระเงิน",
        fields: [
            { id: "reservationFee", label: "ค่าจองห้อง (THB)", type: "number" },
            { id: "accountName", label: "ชื่อบัญชี", type: "text" },
            { id: "bankName", label: "ธนาคาร", type: "text" },
            { id: "accountNumber", label: "เลขที่บัญชี", type: "text" },
            { id: "contactInfo", label: "ข้อมูลติดต่อ (Contact)", type: "textarea" },
        ]
    }
];

const DEFAULT_RESERVATION_LAYOUT = `<div class="p-[20mm] md:p-[25mm] text-black font-[Cordia New] leading-normal relative text-[14pt]" style="font-family: 'Cordia New', sans-serif;">
    
    <div class="text-center font-bold text-xl text-blue-800 mb-4">รายละเอียดการจองห้องเช่า / Rental Reservation</div>

    <table class="w-full border-collapse border border-black">
        <thead>
            <tr class="bg-gray-200">
                <th class="border border-black p-1 w-1/3 text-left pl-2">รายการ / Item</th>
                <th class="border border-black p-1 w-2/3 text-left pl-2">รายละเอียด / Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="border border-black p-1 pl-2">ชื่อโครงการ / Project Name</td>
                <td class="border border-black p-1 pl-2">{{projectName}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ที่ตั้ง / Location</td>
                <td class="border border-black p-1 pl-2">{{projectLocation}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ประเภทห้อง / Room Type</td>
                <td class="border border-black p-1 pl-2">{{roomType}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ขนาด / Size</td>
                <td class="border border-black p-1 pl-2">{{roomSize}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ชั้น / Floor</td>
                <td class="border border-black p-1 pl-2">{{roomFloor}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2 valign-top">เฟอร์นิเจอร์ / Furniture</td>
                <td class="border border-black p-1 pl-2 min-h-[40px]">{{furniture}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2 valign-top">เครื่องใช้ไฟฟ้า / Appliances</td>
                <td class="border border-black p-1 pl-2 min-h-[40px]">{{appliances}}</td>
            </tr>
            <tr><td class="border border-black p-1 bg-gray-100" colspan="2"></td></tr>
            <tr>
                <td class="border border-black p-1 pl-2">ค่าเช่าต่อเดือน / Monthly Rent</td>
                <td class="border border-black p-1 pl-2">{{monthlyRent}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ค่าประกัน / Security Deposit</td>
                <td class="border border-black p-1 pl-2">{{securityDeposit}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">รวมชำระก่อนเข้าอยู่ / Total Cost Before Move-in</td>
                <td class="border border-black p-1 pl-2">{{totalBeforeMoveIn}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">ระยะสัญญา / Contract Term</td>
                <td class="border border-black p-1 pl-2">{{contractTerm}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">วันเริ่มสัญญา / Contract Start Date</td>
                <td class="border border-black p-1 pl-2">{{contractStartDate}}</td>
            </tr>
            <tr>
                <td class="border border-black p-1 pl-2">เข้าอยู่ได้ตั้งแต่ / Move-in Date</td>
                <td class="border border-black p-1 pl-2">{{moveInDate}}</td>
            </tr>
             <tr>
                <td class="border border-black p-1 pl-2 valign-top">เงื่อนไขเพิ่มเติม / Notes</td>
                <td class="border border-black p-1 pl-2">{{notes}}</td>
            </tr>
             <tr>
                <td class="border border-black p-1 pl-2 valign-top">
                    <div>ค่าจองห้อง/Room Reservation fee</div>
                    <div class="text-sm mt-1">*เงินจองจะใช้เป็นค่าเช่าเดือนแรกเมื่อทำสัญญา / The reservation fee will be used as the first month's rent upon signing the contract.</div>
                    <div class="text-sm mt-1">*เงินจองไม่สามารถเรียกคืนได้ / The reservation fee is non-refundable.</div>
                </td>
                <td class="border border-black p-1 pl-2 valign-top relative">
                    <div class="text-right mb-2 font-bold">{{reservationFee}} THB</div>
                    <div class="bg-yellow-200 inline-block px-1 border border-gray-400 text-sm mb-2">✅ จ่ายแล้ว/PAID</div>
                    
                    <div class="w-full h-32 bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-500 text-sm">
                        แนบสลิปโอนได้ (Attach Slip)
                        <!-- If we make this an image field later, we can put img tag here -->
                    </div>
                </td>
            </tr>
             <tr>
                <td class="border border-black p-1 pl-2 valign-top">การชำระเงิน / Payment</td>
                <td class="border border-black p-1 pl-2">
                    <div>Account Name : {{accountName}}</div>
                    <div>Bank Name : {{bankName}}</div>
                    <div>Account number : {{accountNumber}}</div>
                </td>
            </tr>
             <tr>
                <td class="border border-black p-1 pl-2">Contact</td>
                <td class="border border-black p-1 pl-2">{{contactInfo}}</td>
            </tr>
        </tbody>
    </table>

    <div class="mt-8 text-center text-sm text-gray-600">
        <div class="flex justify-end mb-2">
             <img src="/logo_PL_property.png" alt="PL Property" class="h-10 object-contain opacity-70" />
        </div>
        เอกสารฉบับนี้เป็นเพียงข้อเสนอเบื้องต้น ไม่ใช่สัญญาเช่า / This document is a preliminary offer, not a rental agreement.
    </div>

</div>`;

const templates = [
    {
        name: 'สัญญาแต่งตั้งนายหน้าแบบเปิด (Open Agency Agreement)',
        keyword: 'Open Agency',
        content: {
            title: "สัญญาแต่งตั้งนายหน้าแบบเปิด (Open Agency Agreement)",
            sections: DEFAULT_AGENCY_SECTIONS,
            layout: DEFAULT_AGENCY_LAYOUT
        }
    },
    {
        name: 'สัญญาจะซื้อจะขาย (Buy-Sell Agreement)',
        keyword: 'Buy-Sell',
        content: {
            title: "สัญญาจะซื้อจะขาย (Buy-Sell Agreement)",
            sections: DEFAULT_BUY_SECTIONS,
            layout: DEFAULT_BUY_LAYOUT
        }
    },
    {
        name: 'รายละเอียดการจองห้องเช่า (Rental Reservation)',
        keyword: 'Reservation',
        content: {
            title: "รายละเอียดการจองห้องเช่า (Rental Reservation)",
            sections: DEFAULT_RESERVATION_SECTIONS,
            layout: DEFAULT_RESERVATION_LAYOUT
        }
    }
];

async function main() {
    console.log('Seeding templates...');

    for (const t of templates) {
        console.log(`Processing: ${t.name}`);
        const existing = await prisma.contractTemplate.findFirst({
            where: { name: { contains: t.keyword } }
        });

        if (existing) {
            console.log('  - Updating existing...');
            await prisma.contractTemplate.update({
                where: { id: existing.id },
                data: {
                    content: JSON.stringify(t.content)
                }
            });
        } else {
            console.log('  - Creating new...');
            await prisma.contractTemplate.create({
                data: {
                    name: t.name,
                    content: JSON.stringify(t.content)
                }
            });
        }
    }

    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
