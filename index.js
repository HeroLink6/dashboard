// Define Packages
const { Client, GatewayIntentBits } = require('discord.js');
const SoftUI = require('dbd-soft-ui');
const config = require('./config.json');
const os = require('os');
let DBD = require('discord-dashboard');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(config.discord.token);

//category for commands
const moderation = require("./Categorys/moderation");
const community = require("./Categorys/community");

//Setups
const welcomeSetup = require('./Systems/welcome');
const logsSetup = require('./Systems/logs');
const modmailSetup = require('./Systems/modmail');
const jtcSetup = require('./Systems/jtc');
const ticketSetup = require('./Systems/ticket');
const giveawaySetup = require('./Systems/giveaway');

//some imports
const Maintenance = require("./Data/underMaintenance");

//Export modules
module.exports = { client }

//handler
const Handler = new DBD.Handler();

//Locales
const LOCALES = require("./Locales/locales");

//Dashboard
(async ()=>{
    await DBD.useLicense(config.dbd.license);
    DBD.Dashboard = DBD.UpdatedClass();

    const Dashboard = new DBD.Dashboard({
        acceptPrivacyPolicy: true,
        useCategorySet: true,
        //Support Server
        supportServer: {
            slash: '/support-server',
            inviteUrl: 'https://discord.gg/z8nxPve4pn'
        },
        //Port
        port: config.dbd.port,
        //client
        client: config.discord.client,
        //redirect
        redirectUri: `${config.dbd.domain}${config.dbd.redirectUri}`,
        //domain
        domain: config.dbd.domain,
        //owners
        ownerIDs: config.dbd.ownerIDs,
        //Maintenance
        useThemeMaintenance: true,
        useTheme404: true,
        //Join server
        guildAfterAuthorization: {
            use: true,
            guildId: "1121353922355929129"
        },
        //Invite
        invite: {
            clientId: config.discord.client.id,
            scopes:["bot", "applications.commands"],
            permissions: '10982195068151',
        },
        //underMaintenance
        underMaintenance: Maintenance,
        //Permissions
        requiredPermissions: DBD.DISCORD_FLAGS.Permissions.ADMINISTRATOR, 
        //Logs
        minimizedConsoleLogs: true,
        //client
        bot: client,
        //Theme
        theme: SoftUI({
            locales: LOCALES,
            dbdriver: config.database.mongose,
            storage: Handler,
            colorScheme: "blue",
            /*themeColors: {
                secondaryColor: "#000000",
                primaryColor: "#ff0000"
            },*/
            customThemeOptions: {
                index: async ({ req, res, config }) => {
                    let username = req.session?.user?.username || "Guest"

                    const cards = [
                        {
                            title: "Current User",
                            icon: "single-02",
                            getValue: username,
                            progressBar: {
                                enabled: false,
                                getProgress: client.guilds.cache.size
                            }
                        },
                        {
                            title: "CPU",
                            icon: "settings",
                            getValue: os.cpus()[0].model.replace('(R) Core(TM) ', ' ').replace(' CPU ', '').split('@')[0],
                            progressBar: {
                                enabled: false,
                                getProgress: 50
                            }
                        },
                        {
                            title: "System Platform",
                            icon: "single-02",
                            getValue: os.platform(),
                            progressBar: {
                                enabled: false,
                                getProgress: 50
                            }
                        },
                        {
                            title: "Server count",
                            icon: "single-02",
                            getValue: `${client.guilds.cache.size} Guilds`,
                            progressBar: {
                                enabled: true,
                                getProgress: (client.guilds.cache.size / 100) * 100
                            }
                        }
                    ]

                    const graph = {
                        values: [690, 524, 345, 645, 478, 592, 468, 783, 459, 230, 621, 345],
                        labels: ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "10m"]
                    }

                    return {
                        cards,
                        graph,
                        values: [],
                        premium: []
                    }
                },
            },
            websiteName: "Blue Diamond",
            websiteTitle: "Blue Diamond - Imagine a free discord bot",
            dashboardURL: config.dbd.domain,
            supporteMail: "the.haseltons@gmail.com",
            createdBy: "The Blue Diamond Team",
            icons: {
                favicon: "https://cdn.discordapp.com/attachments/1147892533855260823/1147934381491634346/20230903_183644.png",
                noGuildIcon: "https://unlimitedworld.de/attachments/discord-mark-blue-png.64362/",
                sidebar: {
                    darkUrl: 'https://cdn.discordapp.com/attachments/1147892533855260823/1147934381491634346/20230903_183644.png',
                    lightUrl: 'https://cdn.discordapp.com/attachments/1147892533855260823/1147934317553664070/20230903_183622.png',
                    hideName: false,
                    borderRadius: true,
                    alignCenter: true
                },
            },
            index: {
                card: {
                    category: "Blue Diamond",
                    title: "Blue Diamond - imagine a free discord bot",
                    description: "Blue Diamond Panel",
                    image: "https://cdn.discordapp.com/attachments/1147892533855260823/1147934381491634346/20230903_183644.png",
                    link: {
                        enabled: true,
                        url: config.dbd.domain + "/commands"
                    },
                },
                 premium: {
                    enabled: true,
                    card: {
                        title: "Want to support this project?",
                        description: "You can become premium!",
                        bgImage: "https://cdn.discordapp.com/attachments/1112743789782638602/1147933261843157013/20230903_183622.png",
                        button: {
                            text: "Become Premium",
                            url: "https://patreon.com/nexusdevelopment"
                        }
                    }
                },
                feeds: {
                    category: "feeds",
                    title: "Feed",
                    description: "Blue Diamond Panel is still in progress. For questions and suggestions join our discord server!",
                    footer: "Blue Diamond"
                },
                information: {
                    category: "information",
                    title: "Information",
                    description: "Blue Diamond is the most powerful bot on discord. Its 100% free with no ads etc. Lets make paid bots useless.",
                    footer: "Blue Diamond"
                },
                graph: {
                    enabled: true,
                    lineGraph: false,
                    title: 'Memory Usage',
                    tag: 'Memory (MB)',
                    max: 100
                },
                
            },
            footer: {
                replaceDefault: true,
                text: "Made by The Blue Diamond Team"
            },
            sweetalert: {
                errors: {},
                success: {
                    login: "you have been logged in!",
                }
            },
            preloader: {
                image: "https://cdn.discordapp.com/attachments/1112743789782638602/1147938332307898418/discord-avatar-512-E9R4D.gif",
                spinner: false,
                text: "Loading page...",
            },
            admin: {
                pterodactyl: {
                    enabled: false,
                    apiKey: "apiKey",
                    panelLink: "https://panel.website.com",
                    serverUUIDs: []
                },
            },
            commands: [
                moderation,
                community,
            ]}),
            settings: [
                welcomeSetup,
                logsSetup,
                modmailSetup,
                jtcSetup,
                ticketSetup,
                giveawaySetup
            ],
    });
    Dashboard.init();
})();
