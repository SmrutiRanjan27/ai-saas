import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const testimonials = [
    {
        name : "Smruti Ranjan",
        avatar: "S",
        title: "Software Engineer",
        description: "This is the best application I've used!"
    },
    {
        name : "Akash Kumar",
        avatar: "A",
        title: "Data Scitentist",
        description: "So far the best app in the market in field of AI!"
    },
    {
        name : "Mario Gonzales",
        avatar: "M",
        title: "Data Engineer",
        description: "I've used this app for my personal projects and it's been a game changer!"
    },
    {
        name : "Suresh Kumar",
        avatar: "S",
        title: "Data Analyst",
        description: "This app has been a huge help for my work!"
    }
]

export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {testimonials.map((item) => (
                    <Card 
                        key={item.description}
                        className="bg-[#192339] text-white border-none"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-zinc-400 text-sm">{item.title}</p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {item.description}
                            </CardContent>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}