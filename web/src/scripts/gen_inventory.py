
items_appliances = [
    ("Air conditioner with remote control/เครื่องปรับอากาศ + รีโมท", "app_aircon"),
    ("Water heater/เครื่องทำน้ำอุ่น", "app_waterheater"),
    ("Washing machine/เครื่องซักผ้า", "app_washingmachine"),
    ("Dryer/เครื่องอบผ้า", "app_dryer"),
    ("Air Purifier/เครื่องกรองอากาศ", "app_airpurifier"),
    ("Cooker Hood + Electric Stove/เครื่องดูดควัน+เตาไฟฟ้า", "app_stove"),
    ("Light Bulb/หลอดไฟ", "app_lightbulb"),
    ("TV with remote/โทรทัศน์+รีโมท", "app_tv"),
    ("Refrigerator/ตู้เย็น", "app_fridge"),
    ("Microwave/ไมโครเวฟ", "app_microwave"),
    ("Electric oven/เตาไฟฟ้า", "app_oven"),
    ("Kettle/กาต้มน้ำ", "app_kettle"),
    ("Iron/เตารีด + Ironing board/โต๊ะรีดผ้า", "app_iron"),
    ("Fan/พัดลม", "app_fan"),
    ("Lamp/โคมไฟ", "app_lamp"),
    ("Chandelier /โคมไฟเพดาน โคมไฟโมเดิร์น แชนเดอเลียร์", "app_chandelier"),
    ("กุญแจสถานที่เช่า (Room Key)", "key_room"),
    ("คีย์การ์ด (Key Card)", "key_card"),
    ("กุญแจห้องนอน (Bed room Key)", "key_bedroom"),
    ("กุญแจห้องครัว (Kitchen Room Key)", "key_kitchen"),
    ("กุญแจตู้จดหมาย (Mailbox Key)", "key_mailbox"),
    ("สติ๊กเกอร์รถ (Sticker for Car)", "key_sticker"),
    ("เครื่องผ่านเข้าออกที่จอดรถ (E pass for Car)", "key_epass"),
]

items_furniture = [
    ("TV cabinet/ชั้นวางทีวี", "furn_tvcabinet"),
    ("Bed with mattress/เตียงพร้อมฟูก", "furn_bed"),
    ("Built-in cabinet/ตู้ชั้นวางสำเร็จ", "furn_builtin"),
    ("Wardrobe/ตู้เสื้อผ้า", "furn_wardrobe"),
    ("Bedside table /โต๊ะข้างเตียง", "furn_bedside"),
    ("Shower room divider /ฉากกั้นห้องอาบน้ำ", "furn_shower"),
    ("Toilet + Toilet sprayer/ชักโครก+สายฉีดชำระ", "furn_toilet"),
    ("Bathtub/อ่างอาบน้ำ", "furn_bathtub"),
    ("Kitchen set with sink /ชุดครัว พร้อมซิงค์ล้างมือ", "furn_kitchen"),
    ("Sinks and faucets /อ่างล้างมือและก๊อกน้ำ", "furn_sink"),
    ("Carpet/พรม", "furn_carpet"),
    ("Center table/โต๊ะกลางรับแขก", "furn_centertable"),
    ("Shoes cabinet/ตู้ชั้นวางรองเท้า", "furn_shoescabinet"),
    ("Sofa/โซฟา", "furn_sofa"),
    ("Bedding set /ชุดที่นอน", "furn_bedding"),
    ("Dressing table set/ชุดโต๊ะเครื่องแป้ง", "furn_dressing"),
    ("Dining table set with chair/ชุดโต๊ะทานอาหาร พร้อมเก้าอี้", "furn_dining"),
    ("Desk table with chair/โต๊ะทำงานพร้อมเก้าอี้", "furn_desk"),
    ("Curtain/ผ้าม่าน", "furn_curtain"),
    ("Room laminate flooring /พื้นลามิเนต", "furn_flooring"),
    ("Bamboo blind /มู่ลี่", "furn_blind"),
    ("Picture frame /กรอบรูป", "furn_frame"),
    ("Crockery Set ( photos)/ชุดถ้วยจาน ช้อนส้อม (ภาพถ่าย)", "furn_crockery"),
    ("Clothes drying rack outside the balcony /ราวตากผ้านอกระเบียง", "furn_rack"),
]

def generate_fields(items):
    fields = []
    for label, id_base in items:
        fields.append(f"{{ id: '{id_base}_qty', label: '{label} (จำนวน)', type: 'text', placeholder: '1' }},")
        fields.append(f"{{ id: '{id_base}_note', label: '{label} (หมายเหตุ)', type: 'text' }},")
    return "\n            ".join(fields)

def generate_html_rows(items):
    rows = []
    for label, id_base in items:
        rows.append(f"""
        <tr>
            <td class="border border-black p-1">{label}</td>
            <td class="border border-black p-1 text-center">{{{{{id_base}_qty}}}}</td>
            <td class="border border-black p-1">{{{{{id_base}_note}}}}</td>
        </tr>""")
    return "".join(rows)

with open('inventory_output.txt', 'w', encoding='utf-8') as f:
    f.write("--- SECTIONS ---\n")
    f.write(f"""
    {{
        id: 'sec_appliances',
        title: 'รายการกุญแจและเครื่องใช้ไฟฟ้า',
        fields: [
            {generate_fields(items_appliances)}
        ]
    }},
    {{
        id: 'sec_furniture',
        title: 'รายการเฟอร์นิเจอร์',
        fields: [
            {generate_fields(items_furniture)}
        ]
    }},
""")
    f.write("\n--- HTML ---\n")
    f.write(f"""
  <div class="break-before-page">
    <h2 class="font-bold text-center mb-4" style="font-size: 16pt;">กุญแจและเครื่องใช้ไฟฟ้า/Key and Electrical appliances</h2>
    <table class="w-full border-collapse border border-black text-sm mb-8">
        <thead>
            <tr class="bg-gray-200">
                <th class="border border-black p-2 w-1/2">List</th>
                <th class="border border-black p-2 w-1/6">Quantity</th>
                <th class="border border-black p-2">Note</th>
            </tr>
        </thead>
        <tbody>
            {generate_html_rows(items_appliances)}
        </tbody>
    </table>

    <h2 class="font-bold text-center mb-4" style="font-size: 16pt;">เฟอร์นิเจอร์/ Furniture</h2>
    <table class="w-full border-collapse border border-black text-sm">
        <thead>
            <tr class="bg-gray-200">
                <th class="border border-black p-2 w-1/2">List</th>
                <th class="border border-black p-2 w-1/6">Quantity</th>
                <th class="border border-black p-2">Note</th>
            </tr>
        </thead>
        <tbody>
            {generate_html_rows(items_furniture)}
        </tbody>
    </table>
  </div>
""")
