
import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

const DEFAULT_AGENCY_SECTIONS = [
    {
        id: "sec_info",
        title: "ข้อมูลสัญญาและคู่สัญญา",
        fields: [
            { id: "contractDate", label: "วันที่ทำสัญญา (Date)", type: "date" },
            { id: "location", label: "สถานที่ทำสัญญา (Written at)", type: "text" },
            { id: "lessor", label: "ชื่อ-นามสกุล ผู้ให้เช่า (Lessor Name)", type: "text" },
            { id: "lessorId", label: "เลขบัตรประชาชน/Passport No. ผู้ให้เช่า (Lessor ID Card/Passport No.)", type: "text" },
            { id: "lessorAddress", label: "ที่อยู่ ผู้ให้เช่า (Address)", type: "textarea" },
            { id: "lessorPhone", label: "เบอร์โทรศัพท์ (Tel)", type: "text" },
        ]
    },
    {
        id: "sec_property",
        title: "ข้อมูลทรัพย์สินเช่า",
        fields: [
            { id: "projectName", label: "ชื่อโครงการ (Project Name)", type: "text" },
            { id: "propertyLocation", label: "ที่ตั้งทรัพย์สิน (Located at)", type: "textarea" },
            { id: "monthlyRent", label: "อัตราค่าเช่าเดือนละ (Monthly Rent)", type: "number" },
            { id: "contractPeriod", label: "ระยะเวลาสัญญา (เดือน) (Contract Period (Months))", type: "text" },
            { id: "startDate", label: "เริ่มต้นวันที่ (Start Date)", type: "date" },
            { id: "endDate", label: "หมดอายุสัญญาวันที่ (End Date)", type: "date" },
        ]
    },
    {
        id: "sec_sign",
        title: "ลายเซ็นและพยาน",
        fields: [
            { id: "lessorSignature", label: "ลายเซ็นผู้ให้เช่า (Lessor Signature)", type: "signature" },
            { id: "lesseeSignature", label: "ลายเซ็นนายหน้า (Broker Signature)", type: "signature" },
            { id: "witness1Name", label: "ชื่อ-นามสกุล พยาน 1 (Witness 1 Name)", type: "text" },
            { id: "witness1Signature", label: "ลายเซ็นพยาน 1 (Witness 1 Signature)", type: "signature" },
            { id: "witness2Name", label: "ชื่อ-นามสกุล พยาน 2 (Witness 2 Name)", type: "text" },
            { id: "witness2Signature", label: "ลายเซ็นพยาน 2 (Witness 2 Signature)", type: "signature" },
        ]
    },
    {
        id: "sec_docs",
        title: "เอกสารแนบ",
        fields: [
            { id: "lessorIdImage", label: "รูปบัตรประชาชน/Passport ผู้ให้เช่า (Lessor ID Card/Passport Photo)", type: "image" },
            { id: "lesseeIdImage", label: "รูปบัตรประชาชน/Passport นายหน้า (Broker ID Card/Passport Photo)", type: "image" },
        ]
    }
];

const DEFAULT_AGENCY_LAYOUT = `<div class="p-[20mm] md:p-[25mm] text-black font-[Cordia New] leading-relaxed relative" style="font-family: 'Cordia New', sans-serif; font-size: 15pt;">
    
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
        <div class="w-1/3">
             <img src="/logo_PL_property.png" alt="PL Property" class="h-24 object-contain" />
        </div> 
        <div class="text-right w-2/3">
            <div class="font-bold text-xl mb-2">สัญญาแต่งตั้งนายหน้า/ <span class="text-[12pt]">Broker Appointment Agreement</span></div>
            <div class="mb-1">วันที่/<span class="text-[12pt]">Date</span> <span class="font-bold border-b border-dotted border-black px-2 min-w-[150px] inline-block text-center">{{contractDate}}</span></div>
            <div>เขียนที่ / <span class="text-[12pt]">Written at</span> <span class="font-bold border-b border-dotted border-black px-2 min-w-[200px] inline-block text-center">{{location}}</span></div>
        </div>
    </div>

    <div class="mb-4 text-justify">
        สัญญาฉบับนี้ทําขึ้นระหว่าง/ <span class="text-[12pt]">This agreement is made between</span><br/>
        ชื่อ/<span class="text-[12pt]">Name</span> <span class="font-bold border-b border-dotted border-black px-2">{{lessor}}</span>
        <span class="text-[12pt]">ID Card or Passport no</span> <span class="font-bold border-b border-dotted border-black px-2">{{lessorId}}</span><br/>
        ที่อยู่/<span class="text-[12pt]">Address</span> <span class="font-bold border-b border-dotted border-black px-2 w-full block md:inline md:w-auto">{{lessorAddress}}</span>
        <span class="text-[12pt]">Tel</span> <span class="font-bold border-b border-dotted border-black px-2">{{lessorPhone}}</span><br/>
        ซึ่งต่อไปนี้ในสัญญาเรียกว่าผู้ให้เช่า/ <span class="text-[12pt]">Here in after referred to as the "Lessor"</span>
    </div>

    <div class="mb-4 text-justify">
        กับนางนัยนา เวียงพล เลขประจำตัวประชาชน 3700100535206 ที่อยู่เลขที่ 99/680 ม.ชลดาสุวรรณภูมิ ต.ศีรษะจรเข้น้อย อ.บางเสาธง จ.สมุทรปราการ ในสัญญานี้เรียกว่า “นายหน้า” โดยที่ คู่สัญญาทั้งสองฝ่าย ตกลงกันดังนี้<br/>
        <span class="text-[12pt]">And Mrs. Naiyana Wiengpon, Identification No. 3700100535206, residing at 99/680 Chollada Suvarnabhumi Village, Sisa Chorakhe Noi Subdistrict, Bang Sao Thong District, Samut Prakan Province, Here in after referred to as the "Broker"</span>
    </div>

    <div class="space-y-4 text-justify">
        <div>
            1. ผู้ให้เช่าในฐานะผู้มีกรรมสิทธิ์ที่จะให้เช่าและประสงค์จะให้เช่าโครงการชื่อ <span class="font-bold border-b border-dotted border-black px-2">{{projectName}}</span><br/>
            ที่อยู่ <span class="font-bold border-b border-dotted border-black px-2 w-full block md:inline md:w-auto">{{propertyLocation}}</span><br/>
            ในสัญญาเรียกว่า “ทรัพย์สิน” โดยผู้ให้เช่าประสงค์จะให้เช่าทรัพย์สินดังกล่าวพร้อมอุปกรณ์ส่วนควบ และทรัพย์สินที่เกี่ยวข้องทั้งหมดในราคาอัตราค่าเช่าเดือนละ <span class="font-bold border-b border-dotted border-black px-2">{{monthlyRent}}</span> บาท (...................................)<br/>
            มีกําหนดระยะเวลา <span class="font-bold border-b border-dotted border-black px-2">{{contractPeriod}}</span> เดือน โดยเริ่มต้นวันที่ <span class="font-bold border-b border-dotted border-black px-2">{{startDate}}</span> หมดอายุสัญญาวันที่ <span class="font-bold border-b border-dotted border-black px-2">{{endDate}}</span><br/>
            <div class="text-[12pt] text-gray-700 italic mt-1">
                The Lessor, as the rightful owner of the property and wishing to rent it out, hereby appoints the Broker to act on their behalf for the property named: <span class="border-b border-dotted border-black px-1">{{projectName}}</span> Located at <span class="border-b border-dotted border-black px-1">{{propertyLocation}}</span><br/>
                Hereinafter referred to as the “Property”. The Lessor agrees to rent out the Property including all fixtures and relevant items at the monthly rental rate of <span class="border-b border-dotted border-black px-1">{{monthlyRent}}</span> Baht (........................................................) for a period of <span class="border-b border-dotted border-black px-1">{{contractPeriod}}</span> months, starting from <span class="border-b border-dotted border-black px-1">{{startDate}}</span> and ending on <span class="border-b border-dotted border-black px-1">{{endDate}}</span>
            </div>
        </div>

        <div>
            2. ผู้ให้เช่าแต่งตั้งให้นายหน้าเป็นผู้ติดต่อและจัดหาผู้จะเช่าเพื่อให้ผู้ให้เช่า ได้เข้าทําสัญญากับผู้จะเช่าจนเสร็จสิ้นและนายหน้าตกลงรับเป็นผู้ให้บริการจัดหาผู้จะเช่า โดยผู้ให้เช่าตกลงที่จะชําระค่าบริการให้แก่นายหน้าโดย (โปรดเลือก)<br/>
            <div class="text-[12pt] text-gray-700 italic mt-1 mb-2">
                The Lessor appoints the Broker to act as the liaison and to procure a prospective tenant, in order to facilitate and complete the lease agreement between the Lessor and the tenant. The Broker agrees to provide the tenant procurement service. The Lessor agrees to pay the Broker a service fee equivalent to (please choose)
            </div>
            
            <div class="pl-4 space-y-2">
                <div class="flex items-start">
                    <span class="mr-2 text-lg transform translate-y-[-2px]">□</span>
                    <div>
                        ณ วันจอง เป็นเงินจํานวน 0.5 เดือนของค่าเช่า และ ณ วันทำสัญญา เป็นเงินจํานวน 0.5 เดือนของค่าเช่า<br/>
                        <span class="text-[12pt] italic text-gray-600">0.5 month of the rental rate on the booking date, and an additional 0.5 month of the rental rate on the contract signing date.</span>
                    </div>
                </div>
                <div class="flex items-start">
                    <span class="mr-2 text-lg transform translate-y-[-2px]">□</span>
                    <div>
                        ณ วันทำสัญญา เป็นเงินจํานวน 1 เดือนของค่าเช่า<br/>
                        <span class="text-[12pt] italic text-gray-600">1 month of the rental rate on the contract signing date.</span>
                    </div>
                </div>
            </div>

            <div class="mt-4 p-4 border border-gray-300 bg-gray-50 rounded">
                <div class="font-bold">เลขที่บัญชี / <span class="text-[12pt]">Account No.</span></div>
                <div class="text-xl font-bold my-1">6222244559</div>
                <div>SCB Siam Commercial Bank</div>
                <div>Naiyana Wiengpon</div>
            </div>
        </div>

        <div>
            3. ในกรณีที่นายหน้า ได้จัดหาผู้จะเช่าในการเข้าทําสัญญาและรับเงินจองการเช่าจากผู้จะเช่าแทนผู้ให้เช่าไว้แล้วนั้น หากผู้ให้เช่าไม่สามารถส่งมอบทรัพย์สินกับผู้จองเช่าได้ ผู้ให้เช่าตกลงคืนเงินจอง และ/หรือเงินทําสัญญาที่ได้รับไปแล้วทั้งหมด พร้อมชําระค่าบริการให้กับนายหน้าในอัตรา 0.5 เดือนของค่าเช่า<br/>
            <div class="text-[12pt] text-gray-700 italic mt-1">
                In the event that the Broker has secured a prospective tenant and received a booking fee on behalf of the Lessor, and the Lessor fails to deliver the Property to the tenant, the Lessor agrees to fully refund all booking fees and/or contract payments already received, and also agrees to pay the Broker a service fee equal to 0.5 month of the rental rate.
            </div>
        </div>
    </div>

    <div class="mt-6 mb-8 text-justify">
        สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความถูกต้องตรงกันคู่สัญญาได้อ่านและเข้าใจข้อความในสัญญาโดยตลอดดีแล้ว จึงลงลายมือชื่อพร้อมทั้งประทับตรา (ถ้ามี) ไว้เป็นสำคัญต่อหน้าพยานและเก็บไว้ฝ่ายละหนึ่งฉบับ<br/>
        <div class="text-[12pt] text-gray-700 italic mt-1">
            This contract is made in two copies, with the correct message. Both parties have read and understood all the message in the contract. Therefore, signed and stamped (if any) in the presence of witnesses and kept one copy each.
        </div>
    </div>

    <!-- Signatures -->
    <div class="grid grid-cols-2 gap-8 break-inside-avoid">
        <div class="text-center">
            <div class="mb-4">ผู้ให้เช่า <span class="text-[12pt]">LESSOR</span></div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lessorSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lessorSignature ? 'block' : 'none'}}" />
            </div>
            <div class="border-b border-dotted border-black mb-1 mx-4"></div>
            <div><span class="text-[12pt]">Sign</span> (..........................................................)</div>
            <div class="mt-2 text-left px-8"><span class="text-[12pt]">Name</span>: <span class="font-bold">{{lessor}}</span></div>
        </div>
        
        <div class="text-center">
            <div class="mb-4">นายหน้า <span class="text-[12pt]">BROKER</span></div>
            <div class="h-16 flex items-end justify-center relative">
                <img src="{{lesseeSignature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{lesseeSignature ? 'block' : 'none'}}" />
            </div>
            <div class="border-b border-dotted border-black mb-1 mx-4"></div>
            <div><span class="text-[12pt]">Sign</span> (..........................................................)</div>
            <div class="mt-2 text-left px-8"><span class="text-[12pt]">Name</span>: <span class="font-bold">Mrs.Naiyana Wiengpon</span></div>
        </div>
    </div>

    <div class="mt-8 grid grid-cols-2 gap-8 break-inside-avoid">
        <div class="text-center">
            <div class="mb-4">พยาน 1 <span class="text-[12pt]">Witness 1</span></div>
             <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness1Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness1Signature ? 'block' : 'none'}}" />
            </div>
            <div class="border-b border-dotted border-black mb-1 mx-4"></div>
            <div><span class="text-[12pt]">Sign</span> (..........................................................)</div>
            <div class="mt-2 text-left px-8"><span class="text-[12pt]">Name</span>: {{witness1Name}}</div>
        </div>
        
        <div class="text-center">
            <div class="mb-4">พยาน 2 <span class="text-[12pt]">Witness 2</span></div>
             <div class="h-16 flex items-end justify-center relative">
                    <img src="{{witness2Signature}}" class="h-14 absolute bottom-0 max-w-full" style="display: {{witness2Signature ? 'block' : 'none'}}" />
            </div>
            <div class="border-b border-dotted border-black mb-1 mx-4"></div>
            <div><span class="text-[12pt]">Sign</span> (..........................................................)</div>
            <div class="mt-2 text-left px-8"><span class="text-[12pt]">Name</span>: {{witness2Name}}</div>
        </div>
    </div>

    <!-- Attachments -->
    <div class="mt-12 break-before-page">
        <div class="mb-8">
            <div class="font-bold mb-4"><span class="text-[12pt]">Lessor ID Card or Passport</span> / บัตรประชาชนหรือ passport ผู้ให้เช่า</div>
            <img src="{{lessorIdImage}}" class="w-full max-w-md object-contain border" style="display: {{lessorIdImage ? 'block' : 'none'}}; max-height: 400px;" />
        </div>
        
        <div>
            <div class="font-bold mb-4"><span class="text-[12pt]">Broker ID Card or Passport</span> / บัตรประชาชนหรือ passport นายหน้า</div>
            <img src="{{lesseeIdImage}}" class="w-full max-w-md object-contain border" style="display: {{lesseeIdImage ? 'block' : 'none'}}; max-height: 400px;" />
        </div>
    </div>

</div>`;

const DEFAULT_BUY_SECTIONS = [
    {
        id: "sec_info",
        title: "ข้อมูลสัญญา",
        fields: [
            { id: "contractDate", label: "วันที่ทำสัญญา (Date)", type: "date" },
            { id: "location", label: "สถานที่ทำสัญญา (Written at)", type: "text" },
            { id: "transferDate", label: "กำหนดวันโอนกรรมสิทธิ์ (Transfer Date)", type: "date" },
        ]
    },
    {
        id: "sec_parties",
        title: "คู่สัญญา",
        fields: [
            { id: "lessor", label: "ชื่อผู้จะขาย (Seller Name)", type: "text" },
            { id: "lessorId", label: "เลขบัตรประชาชน ผู้จะขาย (Seller ID Card No.)", type: "text" },
            { id: "lessorAddress", label: "ที่อยู่ ผู้จะขาย (Seller Address)", type: "textarea" },
            { id: "lessee", label: "ชื่อผู้จะซื้อ (Buyer Name)", type: "text" },
            { id: "lesseeId", label: "เลขบัตรประชาชน ผู้จะซื้อ (Buyer ID Card No.)", type: "text" },
            { id: "lesseeAddress", label: "ที่อยู่ ผู้จะซื้อ (Buyer Address)", type: "textarea" },
        ]
    },
    {
        id: "sec_property",
        title: "ทรัพย์สินและราคา",
        fields: [
            { id: "propertyDetail", label: "รายละเอียดทรัพย์สิน (เช่น บ้านเลขที่, ประเภท) (Property Details)", type: "textarea" },
            { id: "titleDeedId", label: "เลขที่โฉนด (Title Deed No.)", type: "text" },
            { id: "propertyLocation", label: "ที่ตั้งทรัพย์สิน (Property Location)", type: "textarea" },
            { id: "totalPrice", label: "ราคารวม (ตัวเลข) (Total Price)", type: "number" },
            { id: "depositAmount", label: "เงินมัดจำ (ตัวเลข) (Deposit Amount)", type: "number" },
            { id: "remainingAmount", label: "เงินส่วนที่เหลือ (ตัวเลข) (Remaining Amount)", type: "number" },
        ]
    },
    {
        id: "sec_sign",
        title: "ลายเซ็น",
        fields: [
            { id: "lessorSignature", label: "ลายเซ็นผู้จะขาย (Seller Signature)", type: "signature" },
            { id: "lesseeSignature", label: "ลายเซ็นผู้จะซื้อ (Buyer Signature)", type: "signature" },
            { id: "witness1Name", label: "ชื่อพยาน 1 (Witness 1 Name)", type: "text" },
            { id: "witness1Signature", label: "ลายเซ็นพยาน 1 (Witness 1 Signature)", type: "signature" },
            { id: "witness2Name", label: "ชื่อพยาน 2 (Witness 2 Name)", type: "text" },
            { id: "witness2Signature", label: "ลายเซ็นพยาน 2 (Witness 2 Signature)", type: "signature" },
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
            { id: "projectName", label: "ชื่อโครงการ (Project Name)", type: "text" },
            { id: "projectLocation", label: "ที่ตั้ง (Location)", type: "textarea" },
            { id: "roomType", label: "ประเภทห้อง (Room Type)", type: "text" },
            { id: "roomSize", label: "ขนาด (ตร.ม.) (Size (sq.m.))", type: "text" },
            { id: "roomFloor", label: "ชั้น (Floor)", type: "text" },
            { id: "furniture", label: "เฟอร์นิเจอร์ (Furniture)", type: "textarea" },
            { id: "appliances", label: "เครื่องใช้ไฟฟ้า (Appliances)", type: "textarea" },
        ]
    },
    {
        id: "sec_payment",
        title: "รายละเอียดค่าใช้จ่ายและสัญญา",
        fields: [
            { id: "monthlyRent", label: "ค่าเช่าต่อเดือน (Monthly Rent)", type: "number" },
            { id: "securityDeposit", label: "ค่าประกัน (Security Deposit)", type: "number" },
            { id: "totalBeforeMoveIn", label: "รวมชำระก่อนเข้าอยู่ (Total Before Move-in)", type: "number" },
            { id: "contractTerm", label: "ระยะสัญญา (Contract Term)", type: "text" },
            { id: "contractStartDate", label: "วันเริ่มสัญญา (Start Date)", type: "date" },
            { id: "moveInDate", label: "เข้าอยู่ได้ตั้งแต่ (Move-in Date)", type: "date" },
            { id: "notes", label: "เงื่อนไขเพิ่มเติม (Additional Notes)", type: "textarea" }, // Default: ห้ามเลี้ยงสัตว์, ห้ามสูบบุหรี่
        ]
    },
    {
        id: "sec_reservation",
        title: "การจองและการชำระเงิน",
        fields: [
            { id: "reservationFee", label: "ค่าจองห้อง (THB) (Reservation Fee)", type: "number" },
            { id: "accountName", label: "ชื่อบัญชี (Account Name)", type: "text" },
            { id: "bankName", label: "ธนาคาร (Bank Name)", type: "text" },
            { id: "accountNumber", label: "เลขที่บัญชี (Account Number)", type: "text" },
            { id: "contactInfo", label: "ข้อมูลติดต่อ (Contact Info)", type: "textarea" },
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


import fs from 'fs';
import path from 'path';

// Load Lease Data
const leaseDataPath = path.join(__dirname, 'lease_template_data.json');
const leaseData = JSON.parse(fs.readFileSync(leaseDataPath, 'utf-8'));

const templates = [
    {
        name: 'สัญญาแต่งตั้งนายหน้า (Broker Appointment Agreement)',
        keyword: 'Open Agency',
        content: {
            title: "สัญญาแต่งตั้งนายหน้า (Broker Appointment Agreement)",
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
    },
    {
        name: 'สัญญาเช่ามาตรฐาน (Standard Lease Agreement)',
        keyword: 'สัญญาเช่ามาตรฐาน',
        content: leaseData
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
                    name: t.name,
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
