import streamlit as st
import json

#################### INITIALIZATION ###########################

def initialization():
    st.session_state.edTechID = "edTechID"
    
    st.session_state.Experience = [("type",["Educational","Professional","Vocational","Test"]),("status",["Past","Ongoing","Suggested"])]
    st.session_state.Skill = [("type",["Hard Skill","Soft Skill","Knowledge","Custom"])]
    st.session_state.Choice = [("type",["Educational","Professional","Vocational"]),("status",["Past","Ongoing","Suggested"])]
    st.session_state.Profile = []
    
    st.session_state.ontology = {"Experience":[
                                        "soo:id",
                                        "soo:label",
                                        "soo:description",
                                        "soo:date",
                                        "soo:result"
                                 ],
                                 "Skill":[
                                        "soo:id",
                                        "soo:label",
                                        "soo:description",
                                        "soo:skillLevelValue"
                                 ],
                                 "Profile":[
                                        "soo:id",
                                        "soo:email",
                                        "soo:name"
                                 ],
                                 "Choice":[
                                     "soo:id",
                                     "soo:polarityValue"
                                 ]}
    st.session_state.itemList = []
    st.session_state.mappingList = []
    st.session_state.mapped = []
    st.session_state.submitted =  True

################### PARSING FILE #############################

def parseField(item,field, stringPath = ""):

    if type(item[field]) == list and len(item[field])>0:
        fieldList = [key for key in item[field][0].keys()]
        for nestedField in fieldList:
            if stringPath == "":
                parseField(item[field][0],nestedField,field)
            else:
                parseField(item[field][0],nestedField,f"{stringPath}.{field}")
    else:
        if stringPath:
            st.session_state.fieldList.append(f"{stringPath}.{field}")
        else:  
            st.session_state.fieldList.append(field)
                
def parseFile():
    st.session_state.data = json.load(st.session_state.file)
    st.session_state.fieldList = []
    first_item = st.session_state.data[0] if isinstance(st.session_state.data, list) else st.session_state.data
    fieldList = [key for key in first_item.keys()]
    for field in fieldList:
        with st.container(border=True):
            parseField(first_item,field)
            
    return fieldList

######################### SIDEBAR #########################################

def displaySidebar():
    with st.sidebar:

        st.header("Data Provider", divider="red")
        st.info(st.session_state.edTechID)

        st.header("File", divider="red")
        with st.expander("Fields",expanded=True):
            for field in st.session_state.fieldList[:-1]:
                st.write(f"   ├─ {field} \n")
            st.write(f"   └─ {st.session_state.fieldList[-1]} \n")
        
        if st.sidebar.button("Fill Item List",use_container_width=True):
            fillItemList()
        if len(st.session_state.itemList)>0:
            if st.sidebar.button("Fill Mappings",use_container_width=True):
                fillMappings()
        if st.sidebar.button("Reset", use_container_width=True): 
            st.session_state.clear()
            st.rerun()


def fillItemList():
    st.session_state.itemList = [
        {
            "class": "Experience",
            "name": "mission",
            "language": "en",
            "type": "Professional",
            "status": "Past"
        },
        {
            "class": "Skill",
            "name": "RIASEC_skills",
            "language": "en",
            "type": "Soft Skill"
        }
        ]

def fillMappings():
    mappings = [
        {
            "class": "Experience",
            "name": "Gaming Test",
            "language": "en",
            "type": "Test",
            "status": "Past"
        },
        {
            "class": "Profile",
            "name": "User",
            "language": "en"
        },
        {
            "class": "Experience",
            "name": "Gaming Test",
            "language": "en",
            "type": "Test",
            "status": "Past"
        },
        {
            "class": "Skill",
            "name": "Skill Block",
            "language": "en",
            "type": "Soft Skill"
        },
        {
            "class": "Experience",
            "name": "Gaming Test",
            "language": "en",
            "type": "Test",
            "status": "Past"
        }
        ]
    
    properties = [
        "soo:label",
        "soo:email",
        "soo:date",
        "soo:label",
        "soo:result"
        ]
    
    st.session_state.mapped = []
    st.session_state.mappingList = []
    
    st.session_state[f"generateID_Experience Name"] = True
    st.session_state[f"generateID_User ID"] = True
    st.session_state[f"generateID_Associated Soft Skill Block"] = True
    
    for field,mapping,property in zip(st.session_state.fieldList,mappings,properties):
        st.session_state[f"object_{field}"] = mapping
        st.session_state[f"property4{field}"] = property

            
####################### OBJECT CREATION & DISPLAY #################################

def createTab():
    st.header("Create your objects",divider="red")
    c,h = st.columns([1,2])
    with c:
        create_item_form()
    with h:
        if st.session_state.submitted:
            handle_item_submission()
    st.header("Your Objects",divider="red")
    display_existing_items()

def create_item_form():
    with st.form("Item type"):
        st.header("Add a new item:", divider="red")
        l,r = st.columns([3,1])
        l.selectbox("Select your Object type and language", ["Experience", "Skill", "Choice","Profile"], key="selectedType")
        r.selectbox("Select",["en","de","fr","es","it","re","tr","pl","ro"],key="language",label_visibility="hidden")
        st.text_input("Name your Object", placeholder=f"Object Name", help="Name your Object", key="objectName")
        if st.form_submit_button("Confirm", use_container_width=True) : 
            if st.session_state.objectName:
                st.session_state.submitted = True
            else:
                st.error("An object need a name to be created")


def handle_item_submission():
    with st.form("property match"):
        st.header("Define mandatory properties", divider="red")
        item = {
            "class" : st.session_state.selectedType,
            "name" : st.session_state.objectName,
            "language" : st.session_state.language
        }
        for property,values in st.session_state[st.session_state.selectedType]:
            name,value = st.columns(2)
            name.info(property)
            item[property] = value.selectbox("type",values,label_visibility="collapsed",key=f"{property}_value")
            
        if st.form_submit_button("Create",use_container_width=True):
            st.session_state.itemList.append(item)
            st.session_state.submitted = False
            st.rerun()
            


def display_existing_items():
    cols = st.columns(5)
    cols[0].header("Classe",divider="red")
    cols[1].header("Name",divider="red")
    cols[2].header("Language",divider="red")
    for i in range(3,5):
        cols[i].header(f"Property {i-2}",divider="blue")
    for item in st.session_state.itemList:
        cols[0].success(item["class"])
        cols[1].info(item["name"])
        cols[2].info(item["language"])
        for i,(property,_ )in enumerate(st.session_state[item["class"]]):
            cols[i+3].info(item[property])

########################## RULES CREATION & DISPLAY #####################################

def matchingTab():
    st.header("Map your fields",divider="red")
    create_mapping_form()
    
    st.header("Your Rules",divider="red")
    
    display_existing_rules()
    

def create_mapping_form():
    cols = st.columns(3)
    names = ["Field","Object","Property"]
    for i in range(3):
        cols[i].subheader(names[i],divider="red")
        
    for field in st.session_state.fieldList: 
        if field not in st.session_state.mapped:
            createMatchingForm(field)
        
    if st.button("Create Rules",use_container_width=True):
        for field in st.session_state.fieldList :
            if  field not in st.session_state.mapped and st.session_state[f"object_{field}"]["name"] != "No Mapping":
                create_rule(field)
   
    
def create_rule(field):
    if st.session_state[f"generateID_{field}"] and st.session_state[f'object_{field}']['class'] == 'Experience':
            id_rule = {"id": f"mmr:rule-{len(st.session_state.mappingList)}",
                    "sourcePath": field,
                    "targetClass": f"soo:{st.session_state[f'object_{field}']['class']}",
                    "targetProperty": "id",
                    "targetFunction": "fno:generateId"}
        
            st.session_state.mappingList.append(id_rule)
        
    rule = {"id": f"mmr:rule-{len(st.session_state.mappingList)}",
            "sourcePath": field,
            "targetClass": f"soo:{st.session_state[f'object_{field}']['class']}",
            "targetProperty": st.session_state[f'property4{field}']}
    
    if st.session_state[f"generateID_{field}"] and st.session_state[f'object_{field}']['class'] == 'Profile':
        rule["generateId"] = "true"

        rule["relationTo"] = "soo:Experience"
        rule["relationName"] = "soo:containsExperience"
        rule["relationNameInverse"] =  "soo:hasProfile"
    
    if st.session_state[f"generateID_{field}"] and st.session_state[f'object_{field}']['class'] == 'Skill':
        rule["generateId"] = "true"
        rule["targetFunction"] = "fno:search-for-mapping-with-source"
        rule["relationTo"] = "soo:Experience"
        rule["relationName"] = "soo:resultFromExperience"
        rule["relationNameInverse"] = "soo:hasSkill"
        
    if st.session_state[f'property4{field}'] == "soo:result":
        rule['targetFunction'] = "fno:as-is"
        
    if st.session_state[f'property4{field}'] == "soo:label" and st.session_state[f'object_{field}']['class'] == 'Experience':
        rule[ "targetLang"] = st.session_state[f"object_{field}"]["language"]
        rule['targetFunction'] = rule['targetFunction'] = "fno:asIs_WithLang"
    
    if st.session_state[f'property4{field}'] == "soo:date":
        rule['targetFunction'] = "fno:date-to-xsd"
        
    st.session_state.mappingList.append(rule)
    st.session_state.mapped.append(field)

def createMatchingForm(field):
    f,o,p,t = st.columns([5,5,5,1])
    f.info(field)
    o.selectbox("object",[{"name" : "No Mapping"}] + st.session_state.itemList, format_func=lambda x:x["name"],key=f"object_{field}",label_visibility="collapsed")
    if st.session_state[f"object_{field}"]["name"] != "No Mapping":
        properties = st.session_state.ontology[st.session_state[f"object_{field}"]["class"]]
        p.selectbox("Propriété",properties,key=f"property4{field}",label_visibility="collapsed")
    else:
        p.selectbox("Propriété",[],key=f"property4{field}",label_visibility="collapsed")
    t.checkbox("ID",key = f"generateID_{field}")


def display_existing_rules():
    
    l,r = st.columns(2)
    ruleFile = {"@context": {
                        "todo": "define_the_rules_context"
                    },
                "graph": st.session_state.mappingList}
    l.code(json.dumps(ruleFile,indent=4)) 
    r.code(json.dumps(json.load(open("app/data/PITANGOO/PITANGOO-rules.json","r")),indent=4))

########################## APP LOGIC #####################################
def main():
    st.title("Matching")
    displaySidebar()
    tabs = st.tabs(["Object Creation","Field Mapping"])
    with tabs[0]:
        createTab()
    with tabs[1]:
        matchingTab()

if __name__ == "__main__":
    if "fieldList" not in st.session_state:
        st.set_page_config("Onthology Mapping",layout="centered")
        initialization()
        # file = st.file_uploader("Upload your Json","json",key="file")
        st.session_state.file = open("app/data/PITANGOO/PITANGOO-minimal.json","r")
        if st.session_state.file:
            parseFile()
            st.rerun()
    else:
        st.set_page_config("Onthology Mapping",layout="wide")
        main()