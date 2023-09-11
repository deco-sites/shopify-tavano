import { Section } from "deco/blocks/section.ts";
import { useLivePageContext } from "deco/pages/LivePage.tsx";
import { notUndefined } from "deco/engine/core/utils.ts";

export interface Props{
    title: string;
    components: {
        label: string;
        sections: Section[];
    }[]
}

export default function Library({title, components} : Props){
    const { renderSection } = useLivePageContext();
    
    return(
        <div class="max-w-[1536px] mx-auto">
            <h1 class="text-[64px] mx-auto text-center my-4">{title}</h1>

            <div class="flex gap-24 justify-between">
                <div class="min-w-[160px] sticky self-start flex-auto top-[60px]">
                    {
                        components.map(component => {
                            return(
                                <div class="mt-6">
                                    <h2 class="font-bold text-[18px]">{component.label}</h2>
                                    <ul>
                                    {
                                        component.sections.map((section, idx) => {
                                            return(
                                                <li class="mt-2">
                                                    <a 
                                                    href={`#${component.label}-${idx}`} 
                                                    id={`anchor-${component.label}-${idx}`}
                                                    >
                                                    {component.label} - {idx}
                                                    </a>
                                                    <script
                                                        dangerouslySetInnerHTML={{ __html: `
                                                        document.getElementById('anchor-${component.label}-${idx}')
                                                        .addEventListener("click", function(e){
                                                            e.preventDefault();
                                                            document.getElementById('${component.label}-${idx}')
                                                            .scrollIntoView({behavior: 'smooth'});
                                                        })
                                                        ` }}
                                                        >
                                                            
                                                    </script>
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                    
                                </div>
                            )
                        })
                    }
                </div>
                <div>
                    {
                        components.map((component, idx) => {
                            return(
                                <div>
                                    <span class="text-[24px] font-bold">{component.label}</span>
                                    {
                                        component.sections.map((section, idx) => {
                                            return(
                                                <div class="pt-8" id={`${component.label}-${idx}`}>
                                                    <span>{component.label} - {idx}</span>
                                                    {([section] ?? []).filter(notUndefined).map(renderSection)}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}