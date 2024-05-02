import streamlit as st
st.set_page_config(layout="wide")

def main():
    st.title("Welcome to your data interoperability platfrom !")
    cols = st.columns(3)
    
    with cols[0],st.container(border=True):
        st.header("1 - Onthology Matching",divider="red")   
        st.image("app/ressources/picture_OM.png") 
        st.caption("We designed a Pivot Onthology to facilitate the exchange of data between actors. This tool allow you to map your own onthology to the pivot so that you can send and receive data without having to manually process it each time. The mapping only has to be done once, then each time you send or receive a file, a translation is operated 'on the fly' to accomodate both sides.")
        st.divider()
        if st.button("Let's map my data !",use_container_width=True): st.switch_page("pages/1_Onthology_Mapping.py")
        
    with cols[1],st.container(border=True):
        st.header("2 - Framework Mapping",divider="red")   
        st.image("app/ressources/picture_FM.png")  
        st.caption("This tool allows you to map your own frameworks to standards of the field such as ESCO or PCS. Using our experience in the field of framework alignement, we focused on user experience with a semi-automatic approach to mapping, using state of the art techniques in NLP, AI and information retrieval.")
        st.divider()
        if st.button("Let's map my framework !",use_container_width=True): st.switch_page("pages/2_Framework_Mapping.py")
        
    with cols[2],st.container(border=True):
        st.header("3 - Training Enhancing",divider="red")     
        st.image("app/ressources/picture_SK.png")    
        st.caption("Finally, this last tool helps you enhance your training with skill from standard frameworks (ESCO, ROME ...). Using NLP and AI, you will be provided relevant suggestions for each of you training. From then on, you can select which one are the best match.")
        st.divider()
        if st.button("Let's enhance my trainings !",use_container_width=True): st.switch_page("pages/3_Traning_Enhancement.py")
    
       
if __name__ == "__main__":
    main()
